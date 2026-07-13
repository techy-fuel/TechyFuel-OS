<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, HasUuids, Notifiable;

    /**
     * A person can belong to more than one workspace — one TeamMember row
     * per workspace, same shape as the Supabase multi_workspace_membership
     * design this replaces.
     */
    public function teamMembers()
    {
        return $this->hasMany(\App\Models\TeamMember::class);
    }

    /**
     * This is an API-only app with a separate SPA frontend — there's no
     * "password.reset" Blade route for the default notification to link
     * to. Point it at the frontend's own reset screen instead, passing
     * token + email as query params (FRONTEND_URL configured in .env).
     */
    public function sendPasswordResetNotification($token): void
    {
        $url = rtrim(config('app.frontend_url', config('app.url')), '/')
            .'/reset-password?token='.$token.'&email='.urlencode($this->email);

        $this->notify(new class($token, $url) extends ResetPassword {
            public function __construct(public $token, public $url)
            {
                parent::__construct($token);
            }

            public function toMail($notifiable)
            {
                return parent::buildMailMessage($this->url);
            }
        });
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
