<?php

namespace App\Actions\Fortify;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Actions\AttemptToAuthenticate as FortifyAttemptToAuthenticate;
use Laravel\Fortify\Fortify;
use Symfony\Component\HttpFoundation\Response;

class AttemptToAuthenticate extends FortifyAttemptToAuthenticate
{
    //
}
