<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AccessController;
use App\Http\Controllers\Api\OfficeLocationController;
use App\Http\Controllers\Api\DivisionController;
use App\Http\Controllers\Api\JobTitleController;
use App\Http\Controllers\Api\FileCategoryController;
use App\Http\Controllers\Api\StaffMemberController;
use App\Http\Controllers\Api\StaffFileController;
use App\Http\Controllers\Api\RecognitionCategoryController;
use App\Http\Controllers\Api\RecognitionRecordController;
use App\Http\Controllers\Api\RoleUpgradeController;
use App\Http\Controllers\Api\LocationTransferController;
use App\Http\Controllers\Api\DisciplineNoteController;
use App\Http\Controllers\Api\ExitCategoryController;
use App\Http\Controllers\Api\OffboardingController;
use App\Http\Controllers\Api\VoluntaryExitController;
use App\Http\Controllers\Api\BusinessTripController;
use App\Http\Controllers\Api\GrievanceController;
use App\Http\Controllers\Api\CompanyNoticeController;
use App\Http\Controllers\Api\CompanyHolidayController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/sign-up', [AccessController::class, 'signUp']);
    Route::post('/sign-in', [AccessController::class, 'signIn']);
    Route::post('/forgot-password', [AccessController::class, 'forgotPassword']);
    Route::post('/reset-password', [AccessController::class, 'resetPassword']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    
    // Authentication
    Route::prefix('auth')->group(function () {
        Route::post('/sign-out', [AccessController::class, 'signOut']);
        Route::get('/profile', [AccessController::class, 'profile']);
    });

    // ============================================
    // PROMPT SET 2: Organization Structure
    // ============================================
    Route::apiResource('office-locations', OfficeLocationController::class);
    Route::apiResource('divisions', DivisionController::class);
    Route::apiResource('job-titles', JobTitleController::class);
    Route::apiResource('file-categories', FileCategoryController::class);

    // AJAX endpoints for cascading dropdowns
    Route::post('/fetch-divisions', [DivisionController::class, 'fetchByLocation']);
    Route::post('/fetch-job-titles', [JobTitleController::class, 'fetchByDivision']);

    // ============================================
    // PROMPT SET 3: Staff Member Management
    // ============================================
    Route::apiResource('staff-members', StaffMemberController::class);
    Route::get('/staff-members-dropdown', [StaffMemberController::class, 'dropdown']);
    
    // Staff Files (nested resource)
    Route::get('/staff-members/{staffMember}/files', [StaffFileController::class, 'index']);
    Route::post('/staff-members/{staffMember}/files', [StaffFileController::class, 'store']);
    Route::get('/staff-members/{staffMember}/files/{file}', [StaffFileController::class, 'show']);
    Route::delete('/staff-members/{staffMember}/files/{file}', [StaffFileController::class, 'destroy']);

    // ============================================
    // PROMPT SET 4: Recognition & Advancement
    // ============================================
    Route::apiResource('recognition-categories', RecognitionCategoryController::class);
    Route::apiResource('recognition-records', RecognitionRecordController::class);
    Route::apiResource('role-upgrades', RoleUpgradeController::class);
    Route::apiResource('location-transfers', LocationTransferController::class);

    // ============================================
    // PROMPT SET 5: Discipline & Exit
    // ============================================
    Route::apiResource('discipline-notes', DisciplineNoteController::class);
    Route::apiResource('exit-categories', ExitCategoryController::class);
    Route::apiResource('offboardings', OffboardingController::class);
    Route::apiResource('voluntary-exits', VoluntaryExitController::class);
    Route::post('/voluntary-exits/{voluntaryExit}/process', [VoluntaryExitController::class, 'processApproval']);

    // ============================================
    // PROMPT SET 6: Business Trips & Grievances
    // ============================================
    Route::apiResource('business-trips', BusinessTripController::class);
    Route::post('/business-trips/{businessTrip}/process', [BusinessTripController::class, 'processApproval']);
    
    Route::apiResource('grievances', GrievanceController::class);
    Route::post('/grievances/{grievance}/status', [GrievanceController::class, 'updateStatus']);
    
    Route::apiResource('company-notices', CompanyNoticeController::class);
    Route::post('/company-notices/{companyNotice}/read', [CompanyNoticeController::class, 'markAsRead']);
    
    Route::apiResource('company-holidays', CompanyHolidayController::class);
    Route::post('/company-holidays/bulk-import', [CompanyHolidayController::class, 'bulkImport']);
});
