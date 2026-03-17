interface ApiErrorAlertProps {
  message: string;
}

export const ApiErrorAlert = ({ message }: ApiErrorAlertProps) => (
  <div className="mx-auto my-8 max-w-lg rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center backdrop-blur-md">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="mx-auto mb-3 w-10 text-red-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
      />
    </svg>
    <p className="text-sm text-red-300">{message}</p>
  </div>
);
