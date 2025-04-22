<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\BoardUser;
use App\Models\TaskHeader;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\TaskDetail;
use Illuminate\Support\Facades\Log;
class BoardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $boards = Board::where('user_id', $user->id)
            ->orWhereHas('users', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })
            ->with('users')
            ->get();
        $boards->each(function ($board) {
            $board->encryptedId = Crypt::encrypt($board->id);
        });

        return Inertia::render('todo/Board', [
            'boards' => $boards
        ]);
    }
    public function show($encryptedId)
    {
        $currentId = Auth::id();
        $users = User::where('id', '!=', $currentId)
            ->get();
        $boardId = Crypt::decrypt($encryptedId);
        $board = Board::with('taskHeaders.taskDetails', 'users')->findOrFail($boardId);
        $board->encryptedId = Crypt::encrypt($board->id);
        $existingUserIds = $board->users->pluck('id')->toArray();
        if ($board->taskHeaders) {
            $board->taskHeaders->each(function ($taskHeader) {
                $taskHeader->encryptedId = Crypt::encrypt($taskHeader->id);
            });
        } else {
            $board->taskHeaders = [];
        }
        ;

        $totalTaskDetails = DB::table('task_headers')
            ->leftJoin('task_details', 'task_headers.id', '=', 'task_details.task_id')
            ->where('task_headers.board_id', $boardId)
            ->select('task_headers.id', DB::raw('COUNT(task_details.id) as total_task_details'))
            ->groupBy('task_headers.id')
            ->get();
        // logger()->info('Board Data:', $board->toArray());
        return Inertia::render('todo/BoardShow', [
            'board' => $board,
            'users' => $users,
            'existingUserIds' => $existingUserIds,
            'totalTaskDetails' => $totalTaskDetails
        ]);
    }
    public function storeTask(Request $request, $boardId)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'dead_line' => 'required|date',
            'start' => 'required|date',
            'task_details' => 'nullable|array',
            'task_details.*.title' => 'required|string|max:255',
            'task_details.*.description' => 'nullable|string',
        ]);
        DB::transaction(function () use ($validated, $boardId) {
            $taskHeader = TaskHeader::create([
                'title' => $validated['title'],
                'deskripsi' => $validated['deskripsi'],
                'dead_line' => $validated['dead_line'],
                'start' => $validated['start'],
                'board_id' => $boardId,
            ]);

            if (!empty($validated['task_details'])) {
                foreach ($validated['task_details'] as $detail) {
                    TaskDetail::create([
                        'title' => $detail['title'],
                        'description' => $detail['description'],
                        'isComplet' => false, // default
                        'task_id' => $taskHeader->id,
                    ]);
                }
            }
        });

        return redirect()->back();
    }
    public function updateTaskDetail(Request $request, $taskDetailId)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'isComplet' => 'boolean',
        ]);
        $taskDetail = TaskDetail::findOrFail($taskDetailId);
        $taskDetail->update($validated);

        return redirect()->back();
    }
    public function deleteTaskDetail($taskHeaderId, $taskDetailId)
    {
        DB::transaction(function () use ($taskHeaderId, $taskDetailId) {
            // Hapus task detail berdasarkan taskDetailId yang ada dalam taskHeaderId
            TaskDetail::where('id', $taskDetailId)
                ->where('task_id', $taskHeaderId)
                ->delete();
        });

        return redirect()->back()->with('success', 'Task detail berhasil dihapus!');
    }
    public function showTask($encryptedBoardId, $encryptedTaskHeaderId)
    {
        $boardId = Crypt::decrypt($encryptedBoardId);
        $taskHeaderId = Crypt::decrypt($encryptedTaskHeaderId);
        $taskHeader = TaskHeader::with('taskDetails')->findOrFail($taskHeaderId);


        return Inertia::render('todo/TaskShow', [
            'taskHeader' => $taskHeader,
        ]);

    }

    public function storeBoard(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $board = new Board();
        $board->name = $validatedData['name'];
        $board->user_id = auth()->id();
        $board->created_at = now();
        $board->save();

        return redirect()->back();
    }
    public function storeMultiTaskDetail(Request $request, $taskHeaderId)
    {
        $validator = Validator::make($request->all(), [
            'data' => 'required|array',
            'data.*.title' => 'required|string|max:255',
            'data.*.description' => 'required|string',
            'data.*.isComplet' => 'required|boolean',
        ]);
        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }
        try {
            $taskDetails = [];
            foreach ($request->data as $taskData) {
                $taskDetails[] = TaskDetail::create([
                    'task_id' => $taskHeaderId,
                    'title' => $taskData['title'],
                    'description' => $taskData['description'],
                    'is_complet' => $taskData['isComplet'],
                    // Remove this if not needed: 'task_id' => $taskData['task_id'],
                ]);
            }

            return redirect()->back()
                ->with('success', 'Data berhasil disimpan')
                ->with('data', json_encode($taskDetails));

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Terjadi kesalahan server: ' . $e->getMessage());
        }
    }
    public function inviteFriend(Request $request, $encryptedId)
    {
        try {
            $boardId = Crypt::decrypt($encryptedId);
            $validated = $request->validate([
                'users' => 'required|array',
                'users.*.user_id' => 'required|integer|exists:users,id',
                'users.*.board_id' => 'required|integer|exists:boards,id',
                'users.*.role' => 'required|string|in:member,admin',
            ]);
            DB::beginTransaction();
            $board = Board::findOrFail($boardId);
            foreach ($validated['users'] as $userData) {
                $board->users()->syncWithoutDetaching([
                    $userData['user_id'] => ['role' => $userData['role']]
                ]);
            }
            DB::commit();
            return redirect()->back()->with('success', 'Pengguna berhasil diundang.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }
    public function removeFriend(Request $request, $encryptedId)
    {
        try {
            $boardId = Crypt::decrypt($encryptedId);

            $validated = $request->validate([
                'user_id' => 'required|integer|exists:users,id',
            ]);

            DB::beginTransaction();

            $board = Board::findOrFail($boardId);

            // Pastikan user memang ada di board
            if (!$board->users()->where('user_id', $validated['user_id'])->exists()) {
                return redirect()->back()->with('error', 'Pengguna tidak ditemukan di board ini.');
            }

            // Hapus user dari board
            $board->users()->detach($validated['user_id']);

            DB::commit();
            return redirect()->back()->with('success', 'Pengguna berhasil dihapus.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }


}
