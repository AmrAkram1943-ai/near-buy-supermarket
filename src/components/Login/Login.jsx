import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { supabase } from "../../lib/supabase";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  const supermarket = localStorage.getItem("supermarket");

  if (supermarket) {
    navigate("/dashboard");
  }
}, []);


  const handleLogin = async (e) => {
    e.preventDefault();

    setErrorMsg("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    const userId = data.user?.id;

    if (!userId) {
      setErrorMsg("User not found");
      setLoading(false);
      return;
    }
// const { data: supermarketData, error: supermarketError } = await supabase
//   .from("supermarkets")
//   .select("*")
//   .eq("owner_id", userId)
//   .single();


// console.log("USER ID:", userId);
// console.log("SUPERMARKET DATA:", supermarketData);
// console.log("SUPERMARKET ERROR:", supermarketError);

//     if (supermarketError) {
//       setErrorMsg(supermarketError.message);
//       setLoading(false);
//       return;
//     }

//     localStorage.setItem("supermarket", JSON.stringify(supermarketData));


const { data: supermarketData, error: supermarketError } = await supabase
  .from("supermarkets")
  .select("*")
  .eq("owner_id", userId);

console.log("USER ID:", userId);
console.log("SUPERMARKET DATA:", supermarketData);
console.log("SUPERMARKET ERROR:", supermarketError);

if (supermarketError) {
  setErrorMsg(supermarketError.message);
  setLoading(false);
  return;
}

if (!supermarketData || supermarketData.length === 0) {
  setErrorMsg("No supermarket found for this account");
  setLoading(false);
  return;
}

localStorage.setItem(
  "supermarket",
  JSON.stringify(supermarketData[0])
);





    console.log("Logged in user:", data.user);
    console.log("Logged in supermarket:", supermarketData);

    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-emerald-900">
      <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img src={logo} alt="Company Logo" className="mx-auto h-32 w-auto" />

          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-100"
              >
                Email address
              </label>

              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-100"
                >
                  Password
                </label>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-semibold text-emerald-400 hover:text-emerald-300"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-500 sm:text-sm/6"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="rounded-md bg-red-500/20 p-3 text-sm text-red-200">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-emerald-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-400">
            Not a member?{" "}
            <Link to="/register" className="font-semibold text-emerald-400 hover:text-emerald-300">
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
