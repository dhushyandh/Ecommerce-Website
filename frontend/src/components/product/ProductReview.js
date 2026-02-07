export default function ProductReview({ reviews = [] }) {
    if (!reviews.length) return null;

    return (
        <div className="reviews container mt-4">
            <h3>Other Reviews</h3>
            <hr />

            {reviews.map((review) => {
                const userName =
                    typeof review.user === "object" && review.user?.name
                        ? review.user.name
                        : "User";

                return (
                    <div key={review._id} className="review-card my-3 p-3 bg-white rounded shadow-sm">
                        <div className="rating-outer">
                            <div
                                className="rating-inner"
                                style={{ width: `${(review.rating / 5) * 100}%` }}
                            />
                        </div>

                        <p className="review_user">by {userName}</p>
                        <p className="review_comment">{review.comment}</p>
                        <hr />
                    </div>
                );
            })}
        </div>
    );
}
