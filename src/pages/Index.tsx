import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Layers3,
  Megaphone,
  CreditCard,
  Settings,
  LogOut,
  Search,
  UserPlus,
  Menu,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";
import { toast } from "sonner";

// Simple dark mode toggle using the HTML class
function useTheme() {
  const [dark, setDark] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);
  const toggle = () => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };
  return { dark, toggle };
}

type MenuItem = {
  label: string;
  icon?: JSX.Element;
  active?: boolean;
  children?: { label: string }[];
};

const sidebarMenu: MenuItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, active: true },
  {
    label: "User Management",
    icon: <Users className="h-5 w-5" />,
    children: [{ label: "Users" }, { label: "Roles" }],
  },
  {
    label: "Course Oversight",
    icon: <Layers3 className="h-5 w-5" />,
    children: [{ label: "Courses" }, { label: "Modules" }],
  },
  { label: "Announcement", icon: <Megaphone className="h-5 w-5" /> },
  { label: "Payments", icon: <CreditCard className="h-5 w-5" /> },
];

const revenueData = [
  { month: "Jan", value: 0 },
  { month: "Feb", value: 0 },
  { month: "Mar", value: 0 },
  { month: "Apr", value: 0 },
  { month: "May", value: 0 },
  { month: "Jun", value: 0 },
  { month: "Jul", value: 200000 },
  { month: "Aug", value: 1500000 },
  { month: "Sep", value: 10000 },
  { month: "Oct", value: 20000 },
  { month: "Nov", value: 10000 },
  { month: "Dec", value: 20000 },
];

const StatCard = ({
  title,
  value,
  icon,
  large = false,
}: {
  title: string;
  value: string | number;
  icon: JSX.Element;
  large?: boolean;
}) => (
  <div
    className={
      "hover-scale card-elevated rounded-2xl bg-card p-5 transition-shadow duration-200 border " +
      (large ? "col-span-2" : "")
    }
    role="article"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="rounded-xl bg-primary/10 text-primary p-2">{icon}</div>
      <span className="text-sm text-muted-foreground">{title}</span>
    </div>
    <div className="text-3xl font-semibold tracking-tight">{value}</div>
  </div>
);

const years = ["This Year", "Last Year", "2023"];

const Index = () => {
  // Layout state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "User Management": true,
    "Course Oversight": true,
  });
  const [year, setYear] = useState<string>(years[0]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const [notif, setNotif] = useState(3);
  const { toggle } = useTheme();

  // Search
  const [query, setQuery] = useState("");
  const onSearch = () => {
    toast(`Searching for "${query}"…`);
  };

  const filteredCards = useMemo(() => {
    const q = query.toLowerCase();
    const cards = [
      { title: "Total students", value: 300, icon: <Users className="h-5 w-5" />, large: true },
      { title: "Total Instructors", value: 120, icon: <GraduationCap className="h-5 w-5" />, large: true },
      { title: "Total courses", value: 4, icon: <BookOpen className="h-5 w-5" /> },
      { title: "Number of Modules", value: 120, icon: <Layers3 className="h-5 w-5" /> },
      { title: "Sign-ups This Month", value: 120, icon: <UserPlus className="h-5 w-5" /> },
    ];
    if (!q) return cards;
    return cards.filter((c) => c.title.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <h1 className="sr-only">Kodex Admin Dashboard</h1>

      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-40 bg-background/80 backdrop-blur border-b">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            aria-label="Open sidebar"
            className="rounded-md border p-2 hover:bg-muted"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                placeholder="Search"
                aria-label="Search"
                className="w-full rounded-xl border bg-card px-10 py-2 outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <button
              onClick={onSearch}
              className="rounded-xl bg-primary text-primary-foreground px-3 py-2 hover:opacity-90"
            >
              Go
            </button>
            <button
              aria-label="Toggle theme"
              onClick={toggle}
              className="rounded-xl border px-3 py-2 hover:bg-muted"
            >
              🌗
            </button>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="flex">
        {/* Sidebar overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static z-50 h-full lg:h-auto top-0 left-0 w-72 transform bg-sidebar text-sidebar-foreground border-r card-elevated transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
          aria-label="Sidebar navigation"
        >
          <div className="flex items-center justify-between px-5 h-16 border-b">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary" aria-hidden />
              <span className="font-semibold tracking-tight">KODEX</span>
            </div>
            <button
              className="lg:hidden rounded-md border p-2 hover:bg-muted"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>

          <nav className="p-4 space-y-1">
            {sidebarMenu.map((item) => {
              const isOpen = !!openGroups[item.label];
              const hasChildren = Boolean(item.children?.length);
              return (
                <div key={item.label} className="">
                  <button
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-sidebar-accent ${
                      item.active ? "bg-primary/10 text-primary" : ""
                    }`}
                    onClick={() =>
                      hasChildren
                        ? setOpenGroups((s) => ({ ...s, [item.label]: !s[item.label] }))
                        : undefined
                    }
                    aria-expanded={hasChildren ? isOpen : undefined}
                  >
                    {item.icon}
                    <span className="flex-1">{item.label}</span>
                    {hasChildren && (
                      isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )
                    )}
                  </button>
                  {hasChildren && isOpen && (
                    <div className="ml-10 mt-1 space-y-1 animate-fade-in">
                      {item.children!.map((c) => (
                        <a
                          key={c.label}
                          href="#"
                          className="block rounded-lg px-2 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                        >
                          {c.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="mt-6 pt-4 border-t">
              <div className="text-xs uppercase text-muted-foreground px-2 mb-2">Account</div>
              <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-sidebar-accent">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </a>
              <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-sidebar-accent text-destructive">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </a>
            </div>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 min-h-screen lg:ml-0 lg:pl-0 ml-0 lg:pt-0 pt-2 lg:overflow-visible">
          {/* Top header */}
          <div className="sticky top-0 z-30 hidden lg:block bg-background/80 backdrop-blur border-b">
            <div className="h-16 flex items-center gap-4 px-6">
              <div className="relative flex-1 max-w-3xl">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSearch()}
                  placeholder="Search"
                  aria-label="Search"
                  className="w-full rounded-2xl border bg-card px-11 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>

              <button aria-label="Toggle theme" onClick={toggle} className="rounded-xl border px-3 py-2 hover:bg-muted">
                🌗
              </button>

              <button className="relative rounded-xl border p-2 hover:bg-muted" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                {notif > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                    {notif}
                  </span>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex items-center gap-3 rounded-xl border px-2 py-1 hover:bg-muted"
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                >
                  <img
                    src="https://i.pravatar.cc/40?img=5"
                    alt="User avatar"
                    className="h-9 w-9 rounded-full"
                    loading="lazy"
                  />
                  <ChevronDown className="h-4 w-4" />
                </button>
                {profileOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-xl border bg-card p-1 card-elevated animate-scale-in"
                    role="menu"
                  >
                    <a href="#" className="block rounded-lg px-3 py-2 hover:bg-muted" role="menuitem">
                      Profile
                    </a>
                    <a href="#" className="block rounded-lg px-3 py-2 hover:bg-muted" role="menuitem">
                      Settings
                    </a>
                    <button className="block w-full text-left rounded-lg px-3 py-2 hover:bg-muted text-destructive" role="menuitem">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 lg:px-8 py-6 space-y-6">
            <div className="space-y-1">
              <div className="text-xl lg:text-2xl font-semibold">Welcome back, Admin 👋</div>
              <p className="text-muted-foreground">You're logged in to the Kodex Control Center.</p>
            </div>

            {/* Stats */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredCards.slice(0, 2).map((c) => (
                <StatCard key={c.title} title={c.title} value={c.value} icon={c.icon} large />
              ))}
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCards.slice(2).map((c) => (
                <StatCard key={c.title} title={c.title} value={c.value} icon={c.icon} />
              ))}
            </section>

            {/* Revenue Chart */}
            <section className="rounded-2xl bg-card border card-elevated p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Admin Revenue</h2>
                <div className="relative">
                  <button
                    className="flex items-center gap-2 rounded-xl border px-3 py-2 hover:bg-muted"
                    onClick={() => setYearOpen((o) => !o)}
                    aria-haspopup="listbox"
                    aria-expanded={yearOpen}
                  >
                    {year}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {yearOpen && (
                    <div className="absolute right-0 mt-2 w-40 rounded-xl border bg-card p-1 card-elevated animate-fade-in" role="listbox">
                      {years.map((y) => (
                        <button
                          key={y}
                          className={`block w-full text-left rounded-lg px-3 py-2 hover:bg-muted ${
                            y === year ? "text-primary" : ""
                          }`}
                          onClick={() => {
                            setYear(y);
                            setYearOpen(false);
                          }}
                          role="option"
                          aria-selected={y === year}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${v / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 12,
                      }}
                      formatter={(v: number) => [
                        new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN",
                          maximumFractionDigits: 0,
                        }).format(v),
                        "This Year",
                      ]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Area type="monotone" dataKey="value" stroke="none" fill="url(#rev)" />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
