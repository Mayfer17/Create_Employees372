<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {

        return array_merge(parent::share($request),[ //เรียกใช้ข้อมูลพื้นฐานที่ฟังก์ชัน share จาก parent class
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [ //ประกาศตัวแปร flash และกำหนดค่าสำหรับแสดงข้อความแจ้งเตือน
	            'success' => $request->session()->get('success')?? null , //ดึงข้อความจากsession
	            'error' => $request->session()->get('error')?? null ,
	        ],
        ]);
    }

}
