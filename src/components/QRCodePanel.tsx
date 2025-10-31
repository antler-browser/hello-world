import { QRCodeSVG } from 'qrcode.react';

interface QRCodePanelProps {
  url?: string;
}

export function QRCodePanel({ url }: QRCodePanelProps) {
  const qrUrl = url || window.location.href;

  return (
    <div class="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 p-8">
      <div class="flex justify-center items-end mb-6 relative" style={{ width: '272px', height: '112px' }}>
        <img
          src="/antler-1.png"
          alt="Antler"
          class="absolute left-0 top-0 h-28 w-auto object-contain"
        />
        <img
          src="/antler-2.png"
          alt="Antler"
          class="absolute right-0 top-0 h-28 w-auto object-contain"
        />
      </div>
      <div class="bg-white p-8 rounded-2xl shadow-xl">
        <QRCodeSVG
          value={qrUrl}
          size={256}
          level="H"
        />
      </div>
    </div>
  );
}
