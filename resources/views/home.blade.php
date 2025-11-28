<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Klydos - AI Testing</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #000;
            color: #fff;
            line-height: 1.6;
            overflow-x: hidden;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        h1 {
            font-size: clamp(48px, 8vw, 120px);
            font-weight: 300;
            letter-spacing: -2px;
            margin-bottom: 20px;
        }
        .subtitle {
            font-size: clamp(18px, 2.5vw, 24px);
            color: #888;
            margin-bottom: 60px;
            max-width: 600px;
        }
        .nav {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 100;
        }
        .nav a {
            color: #fff;
            text-decoration: none;
            margin-left: 20px;
            font-size: 14px;
            opacity: 0.7;
            transition: opacity 0.3s;
        }
        .nav a:hover {
            opacity: 1;
        }
        .content {
            margin-top: 100px;
        }
        .section {
            margin-bottom: 100px;
        }
        .section h2 {
            font-size: clamp(24px, 4vw, 36px);
            font-weight: 300;
            margin-bottom: 30px;
            color: #888;
        }
        .section p {
            font-size: clamp(16px, 2vw, 20px);
            max-width: 700px;
            color: #ccc;
            margin-bottom: 20px;
        }
        .btn {
            display: inline-block;
            padding: 12px 30px;
            background: #fff;
            color: #000;
            text-decoration: none;
            font-size: 16px;
            margin-top: 30px;
            transition: transform 0.2s;
        }
        .btn:hover {
            transform: scale(1.05);
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 40px;
            margin-top: 60px;
        }
        .feature {
            border-left: 1px solid #333;
            padding-left: 20px;
        }
        .feature h3 {
            font-size: 20px;
            font-weight: 400;
            margin-bottom: 10px;
        }
        .feature p {
            font-size: 14px;
            color: #888;
        }
        .footer {
            margin-top: 200px;
            padding-top: 40px;
            border-top: 1px solid #333;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        @media (max-width: 768px) {
            .nav {
                position: static;
                margin-bottom: 40px;
            }
            .nav a {
                display: block;
                margin: 10px 0;
            }
            .content {
                margin-top: 40px;
            }
        }
    </style>
</head>
<body>
    <nav class="nav">
        @if (Route::has('login'))
            @auth
                <a href="{{ url('/dashboard') }}">Dashboard</a>
            @else
                <a href="{{ route('login') }}">Login</a>
                @if (Route::has('register'))
                    <a href="{{ route('register') }}">Sign Up</a>
                @endif
            @endauth
        @endif
    </nav>

    <div class="container">
        <div class="content">
            <h1>Klydos_</h1>
            <p class="subtitle">AI-powered testing. No scripts. No hassle. Just results.</p>

            <div class="section">
                <p>Testing modern web apps is time-consuming and complex. Manual testing is slow, and automation scripts require constant updates.</p>
                <p>Klydos automates website testing by generating, executing, and analyzing test cases based on app behavior. It saves time and improves accuracy.</p>
                @if (Route::has('register'))
                    <a href="{{ route('register') }}" class="btn">Get Started</a>
                @endif
            </div>

            <div class="section">
                <h2>What it does</h2>
                <div class="features">
                    <div class="feature">
                        <h3>Functionality Testing</h3>
                        <p>AI agents understand requirements and generate functional tests automatically.</p>
                    </div>
                    <div class="feature">
                        <h3>Customer Experience</h3>
                        <p>Simulate real user behavior and identify friction points.</p>
                    </div>
                    <div class="feature">
                        <h3>Bug Detection</h3>
                        <p>Automatic identification with detailed reports and screenshots.</p>
                    </div>
                    <div class="feature">
                        <h3>Test Execution</h3>
                        <p>Autonomous agents execute tests across browsers and workflows.</p>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>How it works</h2>
                <p>1. Register your account</p>
                <p>2. Define your system behavior</p>
                <p>3. AI generates and runs tests</p>
                <p>4. Get results with insights</p>
            </div>

            <div class="section">
                <h2>Technology</h2>
                <p>Laravel • Python AI (REST API) • MySQL • NLP-based test generation</p>
            </div>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} Klydos. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
