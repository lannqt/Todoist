<?php
use App\Models\TaskHeader;
use App\Models\Board;
use App\Http\Controllers\BoardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        $today = now()->format('Y-m-d');

        // Hitung total board yang dimiliki user
        $totalBoards = Board::where('user_id', Auth::id())
            ->orWhereHas('users', function ($query) {
                $query->where('user_id', Auth::id());
            })
            ->count();

        $tasks = TaskHeader::with(['board', 'taskDetails'])
            ->whereHas('board', function ($query) {
                $query->where('user_id', Auth::id())
                    ->orWhereHas('users', function ($q) {
                        $q->where('user_id', Auth::id());
                    });
            })
            ->orderBy('start', 'asc')
            ->get();
        // dd($tasks->pluck('start'));
        return Inertia::render('dashboard', [
            'tasks' => $tasks,
            'today' => $today,
            'totalBoards' => $totalBoards // Tambahkan ini
        ]);
    })->middleware(['auth'])->name('dashboard');
    Route::get('/boards', [BoardController::class, 'index'])->name('boards.index');
    Route::post('/boards/store', [BoardController::class, 'storeBoard'])->name('boards.store');
    Route::get('/boards/{encryptedId}', [BoardController::class, 'show'])->name('boards.show');
    Route::get('/boards/{encryptedBoardId}/task/{encryptedTaskHeaderId}', [BoardController::class, 'showTask']);
    Route::post('/boards/{board}/task_headers', [BoardController::class, 'storeTask']);
    Route::put('/task_details/{taskDetailId}', [BoardController::class, 'updateTaskDetail']);
    Route::delete('/task/{taskHeaderId}/{taskDetailId}', [BoardController::class, 'deleteTaskDetail'])->name('taskDetail.delete');
    Route::post('/boards/{encryptedId}/invite', [BoardController::class, 'inviteFriend'])->name('board.invite');
    Route::post('/task_headers/{taskHeaderId}/multiDetail', [BoardController::class, 'storeMultiTaskDetail'])->name('store.multiDetail');
    Route::post('/boards/{encryptedId}/remove-user', [BoardController::class, 'removeFriend'])->name('boards.remove-user');




});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
