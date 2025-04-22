<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TaskDetail extends Model
{
     /**
     * The table associated with the model.
     *
     * @var string
     */
    use HasFactory;
    protected $table = 'task_details';
    protected $fillable = ['title', 'description', 'isComplet', 'task_id'];

    public function taskHeader()
    {
        return $this->belongsTo(TaskHeader::class, 'task_id');
    }
}
