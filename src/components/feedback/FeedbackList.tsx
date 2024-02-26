import FeedbackItem from "./FeedbackItem";
import Spinner from "../Spinner";
import ErrorMessage from "../ErrorMessage";
import { useFeedbackItemsStore } from "../../stores/feedbackItemsStore";

// const exampleFeebackItems = [
//   {
//     upvoteCount: 593,
//     badgeLetter: "B",
//     companyName: "Nike",
//     text: "test test test",
//     daysAgo: 4
//   },
//   {
//     upvoteCount: 563,
//     badgeLetter: "S",
//     companyName: "Starbucks",
//     text: "bla bla bla",
//     daysAgo: 3
//   }
// ];

const FeedbackList = () => {
  //get what we need from the FeedbackItems context
  // const { filteredFeedbackItems, isLoading, errorMessage } =
  //   useFeedbackItemsContext();
  const isLoading = useFeedbackItemsStore(state => state.isLoading);
  const errorMessage = useFeedbackItemsStore(state => state.errorMessage);
  const filteredFeedbackItems = useFeedbackItemsStore(state =>
    state.getFilteredFeedbackItems()
  );

  return (
    <ol className="feedback-list">
      {isLoading && <Spinner />}

      {errorMessage && <ErrorMessage message={errorMessage} />}

      {filteredFeedbackItems.map(feedbackItem => (
        <FeedbackItem key={feedbackItem.id} feedbackItem={feedbackItem} />
      ))}
      {/* <FeedBackItem feedbackItem={feebackItem1} />
      <FeedBackItem feedbackItem={feebackItem2} /> */}
    </ol>
  );
};

export default FeedbackList;
