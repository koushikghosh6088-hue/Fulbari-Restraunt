import React from "react";
import { Star } from "lucide-react";

interface GoogleReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleReviewModal = ({ isOpen, onClose }: GoogleReviewModalProps) => {
  if (!isOpen) return null;

  const handleReviewClick = () => {
    // Official Google Review Link for Fulbari Restaurant
    const googleReviewUrl = "https://search.google.com/local/writereview?placeid=ChIJc16FaACF-DkRxbOmYTvrkAY";
    window.open(googleReviewUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal-content relative max-w-md w-full mx-4 overflow-hidden animate-in fade-in scale-in duration-300"
      >
        <div className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-bounce-subtle">
              <Star className="text-primary" size={40} fill="currentColor" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-heading text-foreground">⭐ Loved Our Food?</h2>
            <p className="text-muted-foreground">
              Your review helps our restaurant grow. Share your experience with us on Google to continue!
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleReviewClick}
              className="w-full py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:brightness-110 transition-all shadow-[0_8px_16px_rgba(239,177,29,0.3)] active:translate-y-0.5"
            >
              Leave a Google Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
