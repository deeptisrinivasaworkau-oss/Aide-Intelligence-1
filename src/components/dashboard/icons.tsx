/* Provider and service marks, lifted from the original dashboard. */

export const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

export const SlackIcon = () => (
  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#36C5F0"
      d="M18.9 6.3a4.05 4.05 0 1 0 0 8.1h4.05v-4.05A4.05 4.05 0 0 0 18.9 6.3z"
    />
    <path
      fill="#2EB67D"
      d="M10.8 18.9a4.05 4.05 0 1 0-8.1 0 4.05 4.05 0 0 0 4.05 4.05h4.05V18.9z"
    />
    <path
      fill="#E01E5A"
      d="M29.1 41.7a4.05 4.05 0 1 0 0-8.1h-4.05v4.05a4.05 4.05 0 0 0 4.05 4.05z"
    />
    <path
      fill="#36C5F0"
      d="M29.1 33.6a4.05 4.05 0 1 0 8.1 0 4.05 4.05 0 0 0-4.05-4.05H29.1v4.05z"
    />
    <path
      fill="#ECB22E"
      d="M6.3 29.1a4.05 4.05 0 1 0 8.1 0v-4.05h-4.05A4.05 4.05 0 0 0 6.3 29.1z"
    />
    <path
      fill="#E01E5A"
      d="M18.9 29.1a4.05 4.05 0 1 0 0 8.1 4.05 4.05 0 0 0 4.05-4.05V29.1H18.9z"
    />
  </svg>
);

export const MicrosoftIcon = () => (
  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="19" height="19" fill="#F25022" />
    <rect x="25" y="4" width="19" height="19" fill="#7FBA00" />
    <rect x="4" y="25" width="19" height="19" fill="#00A4EF" />
    <rect x="25" y="25" width="19" height="19" fill="#FFB900" />
  </svg>
);

export const GmailIcon = () => (
  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4285F4" d="M6 40h6V22l-6-4.5z" />
    <path fill="#34A853" d="M36 40h6V17.5L36 22z" />
    <path fill="#FBBC04" d="M36 12.1v9.9l6-4.5v-3.6c0-2.4-2.7-3.7-4.6-2.3z" />
    <path fill="#EA4335" d="M12 22V12l12 9 12-9v10L24 31z" />
    <path fill="#C5221F" d="M6 13.4V17.5L12 22V12l-1.4-1.1C8.7 9.5 6 10.9 6 13.4z" />
  </svg>
);

const CalendarMark = ({ color }: { color: string }) => (
  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="9"
      y="10"
      width="30"
      height="30"
      rx="4"
      fill="#fff"
      stroke={color}
      strokeWidth="3"
    />
    <text
      x="24"
      y="33"
      fontSize="17"
      textAnchor="middle"
      fill={color}
      fontFamily="Arial,Helvetica,sans-serif"
      fontWeight="bold"
    >
      31
    </text>
  </svg>
);

export const GoogleCalendarIcon = () => <CalendarMark color="#4285F4" />;
export const OutlookCalendarIcon = () => <CalendarMark color="#0F6CBD" />;

export const DriveIcon = () => (
  <svg viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
    <path
      d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
      fill="#0066da"
    />
    <path
      d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z"
      fill="#00ac47"
    />
    <path
      d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"
      fill="#ea4335"
    />
    <path
      d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"
      fill="#00832d"
    />
    <path
      d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
      fill="#2684fc"
    />
    <path
      d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"
      fill="#ffba00"
    />
  </svg>
);

export const MeetIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#00832d"
      d="M3 8a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"
    />
    <path fill="#00ac47" d="M14 10.5l6-3.5v10l-6-3.5z" />
  </svg>
);

export const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="5" width="20" height="14" rx="4" fill="#FF0000" />
    <path fill="#fff" d="M10 8.5l6 3.5-6 3.5z" />
  </svg>
);

export const HomeIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4285F4" d="M12 3 2.5 11.5 4 13l1-.9V21h5v-6h4v6h5v-8.9l1 .9 1.5-1.5z" />
  </svg>
);

export const SlackHashIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <text
      x="12"
      y="18"
      fontSize="18"
      textAnchor="middle"
      fill="#611f69"
      fontFamily="Arial,Helvetica,sans-serif"
      fontWeight="bold"
    >
      #
    </text>
  </svg>
);

export const OutlookIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#0364B8"
      d="M2 7a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"
    />
    <path
      fill="#fff"
      d="M8.5 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 1.7a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6z"
    />
    <path fill="#28A8EA" d="M15 9.5l7-2.5v10l-7-2.5z" />
  </svg>
);

export const OneDriveIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#0364B8"
      d="M13 8.5a5 5 0 0 0-4.6 3.05A4 4 0 0 0 5 19.5h13a3.5 3.5 0 0 0 .55-6.96A5 5 0 0 0 13 8.5z"
    />
  </svg>
);

export const TeamsIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="13" height="13" rx="2.5" fill="#5059C9" />
    <text
      x="8.5"
      y="16"
      fontSize="10"
      textAnchor="middle"
      fill="#fff"
      fontFamily="Arial,Helvetica,sans-serif"
      fontWeight="bold"
    >
      T
    </text>
    <circle cx="18.5" cy="9" r="3.2" fill="#7B83EB" />
  </svg>
);
