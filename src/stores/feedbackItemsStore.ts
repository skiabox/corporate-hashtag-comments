import { create } from "zustand";
import { TFeedbackItem } from "../lib/types";

type Store = {
  feedbackItems: TFeedbackItem[];
  isLoading: boolean;
  errorMessage: string;
  selectedCompany: string;
  getCompanyList: () => string[];
  getFilteredFeedbackItems: () => TFeedbackItem[];
  addItemToList: (text: string) => Promise<void>;
  selectCompany: (company: string) => void;
  fetchFeedbackItems: () => Promise<void>;
};

export const useFeedbackItemsStore = create<Store>((set, get) => ({
  feedbackItems: [],
  isLoading: false,
  errorMessage: "",
  selectedCompany: "",
  getCompanyList: () => {
    return get()
      .feedbackItems.map(item => item.company)
      .filter((company, index, array) => array.indexOf(company) === index);
  },
  getFilteredFeedbackItems: () => {
    const state = get();

    return state.selectedCompany
      ? state.feedbackItems.filter(
          feedbackItem => feedbackItem.company === state.selectedCompany
        )
      : state.feedbackItems;
  },
  addItemToList: async (text: string) => {
    const companyName = text
      .split(" ")
      .find(word => word.includes("#"))!
      .substring(1);
    const newItem: TFeedbackItem = {
      id: new Date().getTime(),
      upvoteCount: 0,
      badgeLetter: companyName.substring(0, 1).toUpperCase(),
      company: companyName,
      text: text,
      daysAgo: 0
    };

    // setFeedbackItems([...feedbackItems, newItem]);
    //zustand will merge automatically the new store object with the existing one
    //we return an object below with implicit return (meaning without curcly braces and return keyword)
    set(state => ({
      feedbackItems: [...state.feedbackItems, newItem]
    }));

    await fetch(
      "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks",
      {
        method: "POST",
        body: JSON.stringify(newItem),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );
  },
  selectCompany: (company: string) => {
    // setSelectedCompany(company);
    set(() => ({
      selectedCompany: company
    }));
  },
  fetchFeedbackItems: async () => {
    // setIsLoading(true);
    set(() => ({
      isLoading: true
    }));

    try {
      const response = await fetch(
        "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks"
      );

      // if the response is not ok, throw an error
      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();
      // setFeedbackItems(data.feedbacks);
      set(() => ({
        feedbackItems: data.feedbacks
      }));
    } catch (error) {
      // setErrorMessage("Something went wrong.Please try again later.");
      set(() => ({
        errorMessage: "Something went wrong.Please try again later."
      }));
    }

    // setIsLoading(false);
    set(() => ({
      isLoading: false
    }));
  }
}));
