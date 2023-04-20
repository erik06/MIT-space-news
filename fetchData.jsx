const Pagination = ({ items, pageSize, onPageChange }) => {
  // Part 2 code goes here
  return null;
};

const range = (start, end) => {
  return Array(end - start + 1)
    .fill(0)
    .map((item, i) => start + i);
};

function paginate(items, pageNumber, pageSize) {
  const start = (pageNumber - 1) * pageSize;
  let page = items.slice(start, start + pageSize);
  return page;
}

const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      // Part 1, step 1 code goes here
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios(url);
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

// App that gets data from Hacker News url
function App() {
  const { Fragment, useState, useEffect, useReducer } = React;
  const [query, setQuery] = useState("MIT");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    // "https://hn.algolia.com/api/v1/search?query=MIT",
    "https://api.spaceflightnewsapi.net/v4/articles/?has_event=true&has_launch=true",
    {
      results: [],
    }
  );
  const handlePageChange = (e) => {
    setCurrentPage(Number(e.target.textContent));
  };
  let page = data.results;
  if (page.length >= 1) {
    page = paginate(page, currentPage, pageSize);
    console.log(`currentPage: ${currentPage}`);
  }
  const handleDate = (date) => {
    let parseDate = new Date(date);

    return parseDate.toLocaleString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  return (
    <Fragment>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        // Part 1, step 2 code goes here

        <ul className="list-group">
          {page.map((item, index) => (
            <div
              key={index}
              className="card post-item bg-transparent border-0 mb-5"
            >
              <a href={item.url} target="_blank">
                <img className="card-img-top rounded-0" src={item.image_url} />
              </a>
              <div className="card-body px-0">
                <h2 className="card-title">
                  <a
                    className="text-white opacity-75-onHover"
                    href="post-details.html"
                  >
                    {item.title}
                  </a>
                </h2>
                <ul className="post-meta mt-3">
                  <li className="d-inline-block mr-3">
                    <span className="fas fa-clock text-primary" />
                    <a className="ml-1" href={item.url}>
                      {handleDate(item.published_at)}
                    </a>
                  </li>
                </ul>
                <p className="card-text my-4">{item.summary}</p>
                <a href={item.url} target="_blank" className="btn btn-primary">
                  Read More <img src="images/arrow-right.png" alt />
                </a>
              </div>
            </div>
          ))}
        </ul>
      )}
      <Pagination
        items={data.hits}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      ></Pagination>
    </Fragment>
  );
}

// ========================================
ReactDOM.render(<App />, document.getElementById("root"));
