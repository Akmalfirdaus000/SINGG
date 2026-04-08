<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Models\User;
use App\Responses\LoginResponse;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureActions();
        $this->configureViews();
        $this->configureRateLimiting();
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::authenticateUsing(function (Request $request) {
            $loginField = $request->input('email');

            Log::info('Login attempt', ['email' => $loginField]);

            $user = User::where(function ($query) use ($loginField) {
                $query->where('email', $loginField)
                    ->orWhere('nik', $loginField)
                    ->orWhere('phone', $loginField);
            })->first();

            if (!$user) {
                Log::warning('User not found', ['email' => $loginField]);
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'email' => 'Email/NIK/No HP atau password salah.',
                ]);
            }

            if (!Hash::check($request->input('password'), $user->password_hash)) {
                Log::warning('Password mismatch', ['email' => $loginField, 'user_id' => $user->id]);
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'email' => 'Email/NIK/No HP atau password salah.',
                ]);
            }

            if (!$user->is_active) {
                Log::warning('User not active', ['email' => $loginField, 'user_id' => $user->id]);
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'email' => 'Akun Anda dinonaktifkan. Hubungi admin.',
                ]);
            }

            Log::info('Login successful', ['email' => $loginField, 'user_id' => $user->id]);

            return $user;
        });

        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        Fortify::loginView(fn (Request $request) => Inertia::render('auth/login', [
            'canResetPassword' => Features::enabled(Features::resetPasswords()),
            'canRegister' => Features::enabled(Features::registration()),
            'status' => $request->session()->get('status'),
        ]));

        Fortify::resetPasswordView(fn (Request $request) => Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]));

        Fortify::requestPasswordResetLinkView(fn (Request $request) => Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::verifyEmailView(fn (Request $request) => Inertia::render('auth/verify-email', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::registerView(fn () => Inertia::render('auth/register'));

        Fortify::twoFactorChallengeView(fn () => Inertia::render('auth/two-factor-challenge'));

        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('login', function (Request $request) {
            $loginField = $request->input('email');
            $throttleKey = Str::transliterate(Str::lower($loginField).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });
    }
}
