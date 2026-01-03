export default function ProductReview({ reviews = [] }) {
    if (!reviews.length) return null;

    return (
        <div className="reviews w-75">
            <h3>Other's Reviews:</h3>
            <hr />

            {reviews.map((review) => {
                const userName =
                    typeof review.user === "object" && review.user?.name
                        ? review.user.name
                        : "User";

                return (
                    <div key={review._id} className="review-card my-3">
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
