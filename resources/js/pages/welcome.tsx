import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Plus, ArrowRight, Check, LayoutGrid, Rocket} from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
  <main className="flex w-full max-w-[335px] flex-col-reverse overflow-hidden rounded-xl shadow-xl lg:max-w-4xl lg:flex-row lg:rounded-2xl">
    {/* Content Panel - Enhanced */}
    <div className="flex-1 bg-gradient-to-br from-white to-gray-50 p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.08)] transition-all duration-300 hover:shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.15)] lg:rounded-l-2xl lg:rounded-r-none lg:p-12 dark:from-[#161615] dark:to-[#1e1e1c] dark:shadow-[inset_0px_0px_0px_1px_#fffaed1a] dark:hover:shadow-[inset_0px_0px_0px_1px_#fffaed33]">
      <div className="relative">
        {/* Floating particles background */}
        <div className="absolute -left-10 -top-10 -z-0 h-64 w-64 animate-float rounded-full bg-indigo-100 opacity-20 blur-xl dark:bg-purple-900/30"></div>
        
        <h1 className="relative mb-3 text-2xl font-bold text-gray-900 dark:text-white">
          <span className="relative inline-block">
            <span className="absolute -left-2 -top-1 h-3 w-3 rounded-full bg-indigo-400 opacity-0 transition-all duration-500 group-hover:opacity-100 dark:bg-purple-500"></span>
            Start Organizing Your Life with Todoist
          </span>
        </h1>
        
        <p className="relative mb-6 text-[15px] leading-6 text-[#706f6c] dark:text-[#A1A09A]">
          Todoist helps you organize, plan, and collaborate on tasks and projects. 
          Get started with these simple steps to boost your productivity today.
        </p>
        
        {/* Steps List - Enhanced */}
        <ul className="relative mb-8 flex flex-col gap-4 lg:mb-10">
          {/* Step 1 - Create Tasks */}
          <li className="group relative flex items-start gap-4 rounded-lg p-3 transition-all duration-300 hover:bg-indigo-50/50 dark:hover:bg-purple-900/10">
            <span className="relative mt-1 flex-shrink-0">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600 shadow-sm transition-all duration-300 group-hover:border-indigo-300 group-hover:bg-indigo-100 group-hover:shadow-md dark:border-purple-900 dark:bg-purple-900/30 dark:text-purple-400 dark:group-hover:bg-purple-900/40">
                <Plus className="h-4 w-4" />
              </span>
            </span>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 dark:text-gray-200">Create your first task</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Add tasks with due dates, priorities, and labels to stay organized
              </p>
              <Link 
                href={route('login')}
                className="mt-2 inline-flex items-center text-sm font-medium text-indigo-600 transition-all duration-300 hover:text-indigo-800 hover:underline group-hover:translate-x-1 dark:text-purple-400 dark:hover:text-purple-300"
              >
                Get started
                <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </li>
          
          {/* Step 2 - Complete Tasks */}
          <li className="group relative flex items-start gap-4 rounded-lg p-3 transition-all duration-300 hover:bg-indigo-50/50 dark:hover:bg-purple-900/10">
            <span className="relative mt-1 flex-shrink-0">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600 shadow-sm transition-all duration-300 group-hover:border-indigo-300 group-hover:bg-indigo-100 group-hover:shadow-md dark:border-purple-900 dark:bg-purple-900/30 dark:text-purple-400 dark:group-hover:bg-purple-900/40">
                <Check className="h-4 w-4" />
              </span>
            </span>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 dark:text-gray-200">Mark tasks as completed</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Celebrate your progress by checking off completed tasks
              </p>
            </div>
          </li>
          
          {/* Step 3 - Organize */}
          <li className="group relative flex items-start gap-4 rounded-lg p-3 transition-all duration-300 hover:bg-indigo-50/50 dark:hover:bg-purple-900/10">
            <span className="relative mt-1 flex-shrink-0">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600 shadow-sm transition-all duration-300 group-hover:border-indigo-300 group-hover:bg-indigo-100 group-hover:shadow-md dark:border-purple-900 dark:bg-purple-900/30 dark:text-purple-400 dark:group-hover:bg-purple-900/40">
                <LayoutGrid className="h-4 w-4" />
              </span>
            </span>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 dark:text-gray-200">Organize with projects</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Group related tasks into projects for better organization
              </p>
            </div>
          </li>
        </ul>
        
        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={route('login')}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:hover:shadow-purple-500/20 dark:focus:ring-purple-500"
          >
            <Rocket className="h-4 w-4" />
            Start Your Productivity Journey
          </Link>

        </div>
      </div>
    </div>
    
    {/* Image/Visual Panel */}
    <div className="relative aspect-[335/376] w-full shrink-0 overflow-hidden bg-gradient-to-br from-indigo-50 to-indigo-100 lg:aspect-auto lg:w-[400px] dark:from-purple-900/10 dark:to-purple-900/20">
      {/* Task visualization */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="w-full max-w-xs space-y-4">
          {/* Task card example */}
          <div className="animate-float-delay-1 rounded-xl bg-white p-4 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
            <div className="flex items-start gap-3">
              <button className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 transition-colors duration-200 hover:border-indigo-400 dark:border-gray-600">
                <span className="h-3 w-3 rounded-full"></span>
              </button>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Complete project proposal</h4>
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800 dark:bg-purple-900/30 dark:text-purple-300">Work</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Due tomorrow</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Completed task example */}
          <div className="animate-float-delay-2 rounded-xl bg-white p-4 opacity-90 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
            <div className="flex items-start gap-3">
              <button className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-indigo-400 bg-indigo-100 text-indigo-600 dark:border-purple-500 dark:bg-purple-900/30 dark:text-purple-400">
                <Check className="h-3 w-3" />
              </button>
              <div className="flex-1">
                <h4 className="font-medium text-gray-500 line-through dark:text-gray-500">Buy groceries</h4>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-gray-400">Completed today</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* New task input example */}
          <div className="animate-float-delay-3 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-4 transition-all duration-300 hover:border-indigo-300 dark:border-purple-900/50 dark:bg-purple-900/10">
            <div className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 dark:border-gray-600">
                <span className="h-3 w-3 rounded-full"></span>
              </span>
              <input 
                type="text" 
                placeholder="Add a new task..." 
                className="w-full bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none dark:text-gray-300 dark:placeholder-gray-500" 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/80 to-transparent dark:from-[#161615]/80"></div>
      <div className="absolute inset-0 rounded-xl shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.08)] dark:shadow-[inset_0px_0px_0px_1px_#fffaed1a]"></div>
    </div>
  </main>
</div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
