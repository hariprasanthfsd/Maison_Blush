import React, { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Review } from '../../types';
import { reviewApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface ReviewSectionProps {
  productId: number;
  reviews: Review[];
  onReviewAdded: () => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ productId, reviews, onReviewAdded }) => {
  const [rating, setRating] = useState<number>(5);
  const [reviewerName, setReviewerName] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Please write your review thoughts.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewApi.submitReview({
        productId,
        reviewerName: reviewerName.trim() || 'Verified Buyer',
        rating,
        comment: comment.trim(),
      });
      showToast('Thank you! Your review has been submitted 💕', 'success');
      setComment('');
      setReviewerName('');
      setRating(5);
      onReviewAdded();
    } catch (err: any) {
      showToast('Failed to submit review.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '5.0';

  return (
    <div className="space-y-12">
      
      {/* Review Summary */}
      <div className="bg-[#FAF5F3] p-8 rounded-3xl border border-[#F4E3DF] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <span className="font-script text-2xl text-[#C49A8B]">Client Reviews</span>
          <h3 className="font-serif text-3xl font-bold text-[#2D2325] mt-1">Customer Experience</h3>
          <p className="text-xs text-[#6B5B5E] mt-1">Based on {reviews.length} verified boutique reviews</p>
        </div>

        <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl shadow-soft border border-[#F4E3DF]">
          <span className="font-serif text-4xl font-bold text-[#2D2325]">{avgRating}</span>
          <div>
            <div className="flex items-center text-amber-500 gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-4 h-4 ${s <= Math.round(Number(avgRating)) ? 'fill-current' : 'text-stone-300'}`} />
              ))}
            </div>
            <span className="text-xs text-[#C49A8B] font-semibold mt-0.5 block">Overall Satisfaction</span>
          </div>
        </div>
      </div>

      {/* Review List & Submit Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Review List */}
        <div className="lg:col-span-2 space-y-6">
          <h4 className="font-serif text-xl font-bold text-[#2D2325]">Client Feedback ({reviews.length})</h4>
          
          {reviews.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#F4E3DF]">
              <MessageSquare className="w-10 h-10 text-[#E8C4C0] mx-auto mb-2" />
              <p className="font-serif text-base text-[#2D2325]">Be the first to review this piece</p>
              <p className="text-xs text-[#6B5B5E] mt-1">Share your fit and quality experience with fellow shoppers.</p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-6 rounded-2xl border border-[#F4E3DF] shadow-soft space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-serif text-sm font-bold text-[#2D2325]">{rev.reviewerName}</h5>
                    <span className="text-[10px] text-[#C49A8B]">Verified Buyer • {new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex text-amber-500 gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-current' : 'text-stone-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#4A3E3F] leading-relaxed pt-2 font-light">{rev.comment}</p>
              </div>
            ))
          )}
        </div>

        {/* Submit Form */}
        <div className="bg-white p-6 rounded-3xl border border-[#F4E3DF] shadow-soft h-fit space-y-4">
          <h4 className="font-serif text-lg font-bold text-[#2D2325]">Write a Review</h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Your Rating</label>
              <div className="flex items-center gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-6 h-6 ${star <= rating ? 'fill-current' : 'text-stone-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Your Name</label>
              <input
                type="text"
                placeholder="e.g. Sophia R."
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3 py-2 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Your Thoughts & Fit Notes</label>
              <textarea
                rows={4}
                placeholder="Describe fabric quality, sizing accuracy, and overall fit..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3 py-2 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#2D2325] hover:bg-[#8C5353] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors shadow-sm"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
