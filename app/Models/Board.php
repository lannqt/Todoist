<?php

namespace App\Models;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Database\Eloquent\Model;

class Board extends Model
{
    public function getEncryptedIdAttribute()
    {
        return Crypt::encrypt($this->id);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function taskHeaders()
    {
        return $this->hasMany(TaskHeader::class);
    }
    public function users()
    {
        return $this->belongsToMany(User::class, 'board_user')
            ->withPivot('role') // Jika ada kolom tambahan seperti 'role'
            ->withTimestamps();
    }
}