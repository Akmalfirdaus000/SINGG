<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class LoginController
{
    /**
     * Show login page
     */
    public function create(Request $request)
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => true,
            'canRegister' => true,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle login request
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        $loginField = $request->input('email');

        Log::info('Manual login attempt', ['email' => $loginField]);

        $user = User::where(function ($query) use ($loginField) {
            $query->where('email', $loginField)
                ->orWhere('nik', $loginField)
                ->orWhere('phone', $loginField);
        })->first();

        if (!$user || !Hash::check($request->input('password'), $user->password_hash)) {
            Log::warning('Login failed - invalid credentials', ['email' => $loginField]);
            return back()->withErrors([
                'email' => 'Email/NIK/No HP atau password salah.',
            ])->onlyInput('email');
        }

        if (!$user->is_active) {
            Log::warning('Login failed - user not active', ['email' => $loginField]);
            return back()->withErrors([
                'email' => 'Akun Anda dinonaktifkan. Hubungi admin.',
            ])->onlyInput('email');
        }

        // Regenerate session
        $request->session()->regenerate();

        // Login user
        Auth::guard('web')->login($user, $request->boolean('remember'));

        // Update last login
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
            'failed_login_attempts' => 0,
        ]);

        Log::info('Login successful', [
            'email' => $loginField,
            'user_id' => $user->id,
            'auth_check' => Auth::check() ? 'yes' : 'no',
            'auth_id' => Auth::id(),
        ]);

        // Role-based redirection
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->route('dashboard');
    }

    /**
     * Destroy session (logout)
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
