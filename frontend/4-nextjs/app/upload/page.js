// Placeholder: shelter login and dog uploads need authentication, which is after the MVP.
// The static design is in frontend/2-tailwind/4-dog-upload-login.html (port it here later).
export const metadata = {
  title: "Upload a dog",
};

export default function UploadPage() {
  return (
    <main className="bg-warm-white mx-auto my-[1rem] max-w-[40rem] rounded-[1rem] p-[1.5rem] text-center">
      <h1 className="text-soft-dark-purple mb-[0.5rem] text-[1.5rem] font-semibold">
        Shelter uploads are coming soon 🐶
      </h1>
      <p className="text-dark-brown">
        Soon shelters will be able to sign in and list their dogs here.
      </p>
    </main>
  );
}
