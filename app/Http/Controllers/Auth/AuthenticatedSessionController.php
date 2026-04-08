<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Fortify;
use Laravel\Fortify\Http\Controllers\AuthenticatedSessionController as FortifyAuthenticatedSessionController;

class AuthenticatedSessionController extends FortifyAuthenticatedSessionController
{
    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): \Symfony\Component\HttpFoundation\Response
    {
        Auth::guard('web')->logout();

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return Inertia\Inertia::location('/login');
    }

    /**
     * Show the login view.
     */
    public function create(Request $request): \Inertia\Response
    {
        return Inertia\Inertia::render('auth/login', [
            'canResetPassword' => Fortify::enabled(Fortify::resetPasswords()),
            'canRegister' => Fortify::enabled(Fortify::registration()),
            'status' => $request->session()->get('status'),
        ]);
    }
}
