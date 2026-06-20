import { useState } from "react";
import logo from "../../assets/logo.png";
import { supabase } from "../../lib/supabase";
import { useNavigate, Link } from "react-router-dom";

const egyptGovernorates = [
  "Cairo","Giza","Alexandria","Dakahlia","Red Sea","Beheira","Fayoum","Gharbia","Ismailia","Menofia",
  "Minya","Qalyubia","New Valley","Suez","Aswan","Assiut","Beni Suef","Port Said","Damietta","Sharqia",
  "South Sinai","Kafr El Sheikh","Matrouh","Luxor","Qena","North Sinai","Sohag"];

export default function Register() {
  const [personalName, setPersonalName] = useState("");
  const [supermarketName, setSupermarketName] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [locationSelected, setLocationSelected] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const getCurrentLocation = () => {
    setErrorMsg("");

    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setLocationSelected(true);
      },
      () => {
        setErrorMsg("Failed to get current location");
      }
    );
  };

const handleRegister = async (e) => {
  e.preventDefault();

  setErrorMsg("");
  setSuccessMsg("");

  if (password !== repassword) {
    setErrorMsg("Passwords do not match");
    return;
  }

  if (!governorate) {
    setErrorMsg("Please select your governorate");
    return;
  }

  if (!lat || !lng) {
    setErrorMsg("Please select your supermarket location");
    return;
  }

  setLoading(true);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: "supermarket",
        owner_name: personalName,
        supermarket_name: supermarketName,
        governorate,
        lat: Number(lat),
        lng: Number(lng),
      },
    },
  });

  console.log("SIGNUP DATA:", data);
  console.log("SIGNUP ERROR:", error);

  if (error) {
    setErrorMsg(error.message);
    setLoading(false);
    return;
  }

  const userId = data?.user?.id;

  if (!userId) {
    setErrorMsg("Failed to create user");
    setLoading(false);
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("CURRENT USER:", user);
  console.log("CURRENT SESSION:", session);

  const { error: supermarketError } = await supabase
    .from("supermarkets")
    .insert({
      owner_id: userId,
      owner_name: personalName,
      name: supermarketName,
      email,
      governorate,
      lat: Number(lat),
      lng: Number(lng),
    });

  console.log(
    "SUPERMARKET INSERT ERROR:",
    supermarketError
  );

  if (supermarketError) {
    setErrorMsg(supermarketError.message);
    setLoading(false);
    return;
  }

  setSuccessMsg(
    "Account created successfully. Redirecting to login..."
  );

  setLoading(false);

  setTimeout(() => {
    navigate("/login");
  }, 1500);
};

  return (
    <div className="min-h-screen bg-emerald-900">
      <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            src={logo}
            alt="Company Logo"
            className="mx-auto h-32 w-auto"
          />

          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
            Create Supermarket Account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-100">
                Your Name
              </label>

              <div className="mt-2">
                <input
                  type="text"
                  required
                  value={personalName}
                  onChange={(e) => setPersonalName(e.target.value)}
                  className="block w-full rounded-md bg-white/5 px-3 py-2 text-white outline outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-100">
                Supermarket Name
              </label>

              <div className="mt-2">
                <input
                  type="text"
                  required
                  value={supermarketName}
                  onChange={(e) => setSupermarketName(e.target.value)}
                  className="block w-full rounded-md bg-white/5 px-3 py-2 text-white outline outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-100">
                Governorate
              </label>

              <div className="mt-2">
                <select
                  required
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="block w-full rounded-md bg-emerald-950 px-3 py-2 text-white outline outline-1 outline-white/10 focus:outline-2 focus:outline-emerald-500"
                >
                  <option value="">Select governorate</option>
                  {egyptGovernorates.map((gov) => (
                    <option key={gov} value={gov}>
                      {gov}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-100">
                Email Address
              </label>

              <div className="mt-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md bg-white/5 px-3 py-2 text-white outline outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-100">
                Password
              </label>

              <div className="mt-2">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-white/5 px-3 py-2 text-white outline outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-100">
                Repassword
              </label>

              <div className="mt-2">
                <input
                  type="password"
                  required
                  value={repassword}
                  onChange={(e) => setRepassword(e.target.value)}
                  className="block w-full rounded-md bg-white/5 px-3 py-2 text-white outline outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-emerald-500"
                />
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={getCurrentLocation}
                className="flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
              >
                Use Current Location
              </button>

              {locationSelected && (
                <p className="mt-2 text-center text-sm text-green-300">
                  Location selected successfully
                </p>
              )}
            </div>

            {errorMsg && (
              <p className="rounded-md bg-red-500/20 p-3 text-sm text-red-200">
                {errorMsg}
              </p>
            )}

            {successMsg && (
              <p className="rounded-md bg-green-500/20 p-3 text-sm text-green-200">
                {successMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-emerald-500 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-400">
            You already have an account?{" "}
            <Link to="/login" className="font-semibold text-emerald-400 hover:text-emerald-300">
              Login Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}