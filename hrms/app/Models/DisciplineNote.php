<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DisciplineNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'staff_member_id',
        'issued_to_user_id',
        'subject',
        'issue_date',
        'details',
        'tenant_id',
        'author_id',
    ];

    protected $casts = [
        'issue_date' => 'date',
    ];

    public function staffMember()
    {
        return $this->belongsTo(StaffMember::class);
    }

    public function issuedToUser()
    {
        return $this->belongsTo(User::class, 'issued_to_user_id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
