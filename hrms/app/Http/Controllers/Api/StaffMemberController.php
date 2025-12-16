<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StaffMember;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StaffMemberController extends Controller
{
    /**
     * Display a listing of staff members.
     */
    public function index(Request $request)
    {
        $query = StaffMember::with(['user', 'officeLocation', 'division', 'jobTitle']);

        // Filters
        if ($request->filled('office_location_id')) {
            $query->forLocation($request->office_location_id);
        }
        if ($request->filled('division_id')) {
            $query->forDivision($request->division_id);
        }
        if ($request->filled('status')) {
            $query->where('employment_status', $request->status);
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('staff_code', 'like', "%{$search}%")
                    ->orWhere('personal_email', 'like', "%{$search}%");
            });
        }

        $staffMembers = $request->boolean('paginate', true)
            ? $query->latest()->paginate($request->input('per_page', 15))
            : $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $staffMembers,
        ]);
    }

    /**
     * Store a newly created staff member.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'nullable|string|min:8',
            'personal_email' => 'nullable|email',
            'mobile_number' => 'nullable|string|max:20',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'home_address' => 'nullable|string',
            'nationality' => 'nullable|string|max:100',
            'passport_number' => 'nullable|string|max:50',
            'country_code' => 'nullable|string|max:3',
            'region' => 'nullable|string|max:100',
            'city_name' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'biometric_id' => 'nullable|string|max:50',
            'office_location_id' => 'nullable|exists:office_locations,id',
            'division_id' => 'nullable|exists:divisions,id',
            'job_title_id' => 'nullable|exists:job_titles,id',
            'hire_date' => 'nullable|date',
            'bank_account_name' => 'nullable|string',
            'bank_account_number' => 'nullable|string|max:50',
            'bank_name' => 'nullable|string',
            'bank_branch' => 'nullable|string',
            'compensation_type' => 'nullable|in:monthly,hourly,daily,contract',
            'base_salary' => 'nullable|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            // Create user account
            $user = User::create([
                'name' => $validated['full_name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password'] ?? 'password123'),
                'is_active' => true,
            ]);
            $user->assignRole('staff_member');

            // Create staff member
            $staffData = collect($validated)->except(['email', 'password'])->toArray();
            $staffData['user_id'] = $user->id;
            $staffData['author_id'] = $request->user()->id;

            $staffMember = StaffMember::create($staffData);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Staff member created successfully',
                'data' => $staffMember->load(['user', 'officeLocation', 'division', 'jobTitle']),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create staff member: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified staff member.
     */
    public function show(StaffMember $staffMember)
    {
        return response()->json([
            'success' => true,
            'data' => $staffMember->load([
                'user',
                'officeLocation',
                'division',
                'jobTitle',
                'files.fileCategory',
                'recognitionRecords.category',
                'roleUpgrades.newJobTitle',
                'disciplineNotes',
            ]),
        ]);
    }

    /**
     * Update the specified staff member.
     */
    public function update(Request $request, StaffMember $staffMember)
    {
        $validated = $request->validate([
            'full_name' => 'sometimes|required|string|max:255',
            'personal_email' => 'nullable|email',
            'mobile_number' => 'nullable|string|max:20',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'home_address' => 'nullable|string',
            'nationality' => 'nullable|string|max:100',
            'passport_number' => 'nullable|string|max:50',
            'country_code' => 'nullable|string|max:3',
            'region' => 'nullable|string|max:100',
            'city_name' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'biometric_id' => 'nullable|string|max:50',
            'office_location_id' => 'nullable|exists:office_locations,id',
            'division_id' => 'nullable|exists:divisions,id',
            'job_title_id' => 'nullable|exists:job_titles,id',
            'hire_date' => 'nullable|date',
            'bank_account_name' => 'nullable|string',
            'bank_account_number' => 'nullable|string|max:50',
            'bank_name' => 'nullable|string',
            'bank_branch' => 'nullable|string',
            'compensation_type' => 'nullable|in:monthly,hourly,daily,contract',
            'base_salary' => 'nullable|numeric|min:0',
            'employment_status' => 'nullable|in:active,on_leave,suspended,terminated,resigned',
        ]);

        $staffMember->update($validated);

        // Update linked user name if full_name changed
        if (isset($validated['full_name'])) {
            $staffMember->user->update(['name' => $validated['full_name']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Staff member updated successfully',
            'data' => $staffMember->fresh(['user', 'officeLocation', 'division', 'jobTitle']),
        ]);
    }

    /**
     * Remove the specified staff member.
     */
    public function destroy(StaffMember $staffMember)
    {
        $staffMember->user->update(['is_active' => false]);
        $staffMember->update(['employment_status' => 'terminated']);
        $staffMember->delete();

        return response()->json([
            'success' => true,
            'message' => 'Staff member deactivated successfully',
        ]);
    }

    /**
     * Get staff members for dropdown.
     */
    public function dropdown(Request $request)
    {
        $query = StaffMember::active()->select('id', 'full_name', 'staff_code');

        if ($request->filled('office_location_id')) {
            $query->forLocation($request->office_location_id);
        }
        if ($request->filled('division_id')) {
            $query->forDivision($request->division_id);
        }

        return response()->json([
            'success' => true,
            'data' => $query->orderBy('full_name')->get(),
        ]);
    }
}
