import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex flex-1 items-center justify-center px-5 py-10">
      <div className="flex w-full max-w-2xl flex-col items-center justify-center rounded-[30px] border border-dark-4 bg-dark-2 p-8 text-center shadow-lg md:p-12">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-dark-4 text-3xl font-bold text-light-1">
          404
        </div>

        <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-light-3">
          Page not found
        </p>
        <h1 className="h2-bold md:h1-bold text-light-1">This page doesn’t exist</h1>
        <p className="mt-4 max-w-md text-base text-light-3">
          The profile, post, or route you’re looking for could not be found.
          Head back to the community feed or search for another profile.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/">
            <Button className="shad-button_primary">Go home</Button>
          </Link>
          <Link to="/all-users">
            <Button variant="secondary" className="bg-dark-4 text-light-1 hover:bg-dark-3">
              Find users
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
