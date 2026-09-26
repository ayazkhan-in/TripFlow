import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// --- HELPER COMPONENTS (ICONS) ---

export const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
  </svg>
);

// --- TYPE DEFINITIONS ---

export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
  role?: string;
}

export interface SignInPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn?: () => void;
  onResetPassword?: () => void;
  onCreateAccount?: () => void;
}

// --- SUB-COMPONENTS ---

export const GlassInputWrapper = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md transition-all duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15 focus-within:bg-white shadow-xs ${className}`}>
    {children}
  </div>
);

export const TestimonialCard = ({ testimonial, delay }: { testimonial: Testimonial; delay: string }) => (
  <div className={`animate-testimonial ${delay} flex items-start gap-3 rounded-2xl bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 shadow-xl p-4 w-72 text-left`}>
    <img src={testimonial.avatarSrc} className="h-10 w-10 object-cover rounded-xl shrink-0 border border-white/60 shadow-xs" alt={testimonial.name} />
    <div className="text-xs leading-snug">
      <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
        <span>{testimonial.name}</span>
        {testimonial.role && (
          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800">
            {testimonial.role}
          </span>
        )}
      </div>
      <p className="text-slate-400 dark:text-slate-400 text-[11px] font-medium">{testimonial.handle}</p>
      <p className="mt-1.5 text-slate-700 dark:text-slate-300 font-normal leading-relaxed text-[11.5px] line-clamp-3">
        "{testimonial.text}"
      </p>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export const SignInPage: React.FC<SignInPageProps> = ({
  title = <span className="font-bold text-slate-900 tracking-tight">Welcome Back</span>,
  description = "Access your account and continue your journey with Bookit",
  heroImageSrc,
  testimonials = [],
  onSignIn,
  onGoogleSignIn,
  onResetPassword,
  onCreateAccount,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full font-sans bg-[#F7F8FA] text-slate-900">
      {/* Left column: sign-in form */}
      <section className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="animate-element animate-delay-100 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                {title}
              </h1>
              <p className="animate-element animate-delay-200 text-sm text-slate-500 mt-2 font-normal">
                {description}
              </p>
            </div>

            <form className="space-y-4" onSubmit={onSignIn}>
              <div className="animate-element animate-delay-300">
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                  Email Address
                </label>
                <GlassInputWrapper>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="w-full bg-transparent text-sm p-3.5 rounded-2xl focus:outline-none placeholder:text-slate-400"
                  />
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-400">
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                  Password
                </label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      className="w-full bg-transparent text-sm p-3.5 pr-11 rounded-2xl focus:outline-none placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-500 flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" name="rememberMe" className="custom-checkbox" />
                  <span className="text-slate-600 font-medium">Keep me signed in</span>
                </label>
                <button
                  type="button"
                  onClick={onResetPassword}
                  className="hover:underline text-blue-600 font-semibold transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="animate-element animate-delay-600 w-full rounded-2xl bg-[#004AC6] hover:bg-[#003899] py-3.5 font-bold text-sm text-white shadow-lg shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                Sign In
              </button>
            </form>

            <div className="animate-element animate-delay-700 relative flex items-center justify-center my-1">
              <span className="w-full border-t border-slate-200"></span>
              <span className="px-3 text-xs text-slate-400 bg-[#F7F8FA] absolute font-medium">
                Or continue with
              </span>
            </div>

            <button
              type="button"
              onClick={onGoogleSignIn}
              className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 border border-slate-200 rounded-2xl py-3.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <p className="animate-element animate-delay-900 text-center text-xs text-slate-500">
              New to Bookit?{' '}
              <button
                type="button"
                onClick={onCreateAccount}
                className="text-blue-600 font-bold hover:underline transition-colors cursor-pointer"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* Right column: hero image + testimonials */}
      {heroImageSrc && (
        <section className="hidden lg:block flex-1 relative p-6">
          <div
            className="animate-slide-right animate-delay-300 absolute inset-6 rounded-3xl bg-cover bg-center shadow-2xl overflow-hidden"
            style={{ backgroundImage: `url(${heroImageSrc})` }}
          >
            {/* Subtle gradient vignette over hero */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-slate-900/30" />

            {/* Top brand accent */}
            <div className="absolute top-8 left-8 right-8 flex items-center justify-between text-white">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Real-time Tour Telemetry Active</span>
              </div>
              <span className="text-xs font-medium text-white/70">Bookit v2.4</span>
            </div>

            {/* Testimonials */}
            {testimonials.length > 0 && (
              <div className="absolute bottom-8 left-0 right-0 flex gap-4 px-8 justify-center flex-wrap">
                <TestimonialCard testimonial={testimonials[0]} delay="animate-delay-1000" />
                {testimonials[1] && (
                  <div className="hidden xl:flex">
                    <TestimonialCard testimonial={testimonials[1]} delay="animate-delay-1200" />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
