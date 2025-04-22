<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskHeader extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    use HasFactory;
    protected $table = 'task_headers';
    protected $fillable = ['title', 'deskripsi', 'dead_line', 'board_id', 'start'];

    public function board()
    {
        return $this->belongsTo(Board::class);
    }
    public function taskDetails()
    {
        return $this->hasMany(TaskDetail::class, 'task_id');
    }
}
