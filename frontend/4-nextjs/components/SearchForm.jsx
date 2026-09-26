import Form from "next/form";

// Ported from the search form in frontend/2-tailwind/1-home.html
// Changes from the static version (see API_CONTRACT.md and #5):
// - Submits to /search with the chosen filters in the URL (the old SEARCH button was a plain link)
// - "All Countries" sends an empty value instead of "estonia"
// - Age groups no longer overlap (0-1, 2-5, 6+) and there is an "All" option
// - X-Large is removed (the backend has small / medium / large only)
// - "Keyword" searches by breed, matching the API's breed filter
// - ID Number search is hidden until #5 decides on an ID field

function Choice({ type, name, value, label, defaultChecked }) {
  return (
    <label>
      <input
        type={type}
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="mr-[0.5rem]"
      />
      {label}
    </label>
  );
}

export default function SearchForm() {
  return (
    <div className="relative ml-[0.5rem] flex-1">
      <Form
        action="/search"
        className="relative flex flex-wrap items-start justify-start gap-x-0 gap-y-[1rem] overflow-visible pr-0"
      >
        {/* Sex */}
        <div className="ml-[2rem] flex min-w-[6.5rem] flex-col gap-y-[0.3rem] text-[0.85rem]">
          <p className="text-soft-dark-purple mb-[0.8rem] text-[1rem] font-semibold">Sex:</p>
          <Choice type="radio" name="sex" value="all" label="All" defaultChecked />
          <Choice type="radio" name="sex" value="female" label="Female" />
          <Choice type="radio" name="sex" value="male" label="Male" />
        </div>

        {/* Age */}
        <div className="flex min-w-[7rem] flex-col gap-y-[0.3rem] text-[0.85rem]">
          <p className="text-soft-dark-purple mb-[0.8rem] text-[1rem] font-semibold">Age:</p>
          <Choice type="radio" name="age" value="" label="All" defaultChecked />
          <Choice type="radio" name="age" value="0-1" label="0-1 year" />
          <Choice type="radio" name="age" value="2-5" label="2-5 years" />
          <Choice type="radio" name="age" value="6+" label="6+ years" />
        </div>

        {/* Size */}
        <div className="flex min-w-[7rem] flex-col gap-y-[0.3rem] text-[0.85rem]">
          <p className="text-soft-dark-purple mb-[0.8rem] text-[1rem] font-semibold">Size:</p>
          <Choice type="checkbox" name="size" value="small" label="Small" />
          <Choice type="checkbox" name="size" value="medium" label="Medium" />
          <Choice type="checkbox" name="size" value="large" label="Large" />
        </div>

        {/* Country */}
        <div className="mr-[2.1rem] flex flex-col text-[0.85rem]">
          <label htmlFor="country" className="text-soft-dark-purple mb-[0.8rem] text-[1rem] font-semibold">
            Country:
          </label>
          <select id="country" name="country" defaultValue="" className="border-light-gray w-[7rem] rounded-[0.3125rem] border bg-white p-[0.25rem] text-[0.9rem]">
            <option value="">All Countries</option>
            <option value="Estonia">Estonia</option>
            <option value="Latvia">Latvia</option>
            <option value="Lithuania">Lithuania</option>
          </select>
        </div>

        {/* Breed */}
        <div className="mr-[2.1rem] flex flex-col text-[0.85rem]">
          <label htmlFor="breed" className="text-soft-dark-purple mb-[0.8rem] text-[1rem] font-semibold">
            Breed
          </label>
          <input
            type="text"
            id="breed"
            name="breed"
            placeholder="e.g. labrador"
            className="border-light-gray w-[7rem] rounded-[0.3125rem] border bg-white p-[0.25rem] text-[0.9rem]"
          />
          <small className="text-medium-brown mt-[0.2rem] w-[7rem] text-[0.75rem] opacity-80">Optional — leave blank to search all dogs</small>
        </div>

        {/* Submit */}
        <div className="ml-[0.5rem] flex min-h-[10rem] flex-col items-start justify-start">
          <button
            type="submit"
            className="mt-[1.2rem] ml-[0.2rem] flex max-w-[8rem] cursor-pointer items-center justify-center rounded-xl border-2 border-gray-300 bg-gray-100 py-1 pr-1 pl-2 text-base font-medium tracking-wide text-gray-600 shadow-xl transition-all duration-400 ease-in-out hover:bg-gray-200 hover:shadow-2xl"
          >
            SEARCH 🎉
          </button>
        </div>
      </Form>
    </div>
  );
}
