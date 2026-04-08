<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class AuthenticateUser
{
    /**
     * Attempt to authenticate the user.
     */
    public function __invoke($request, $next)
    {
        $loginField = $request->input('email');

        $user = User::where(function ($query) use ($loginField) {
            $query->where('email', $loginField)
                ->orWhere('nik', $loginField)
                ->orWhere('phone', $loginField);
        })->first();

        if (!$user || !Hash::check($request->input('password'), $user->password_hash)) {
            return redirect()->back()->withErrors([
                'email' => 'Email/NIK/No HP atau password salah.',
            ])->withInput($request->only('email'));
        }

        if (!$user->is_active) {
            return redirect()->back()->withErrors([
                'email' => 'Akun Anda dinonaktifkan. Hubungi admin.',
            ])->withInput($request->only('email'));
        }

        // Login user
        auth()->login($user, $request->filled('remember'));

        // Update last login
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
            'failed_login_attempts' => 0,
        ]);

        return app(LoginResponseContract::class);
    }
}
