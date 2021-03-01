import React, {useEffect, useRef, useState} from 'react'
import {movie} from "../../../VMoviePageApi";
import {
    AvatarSC,
    BodySC,
    ContentSC,
    DateSC,
    InfoSC,
    NameSC, NoCommSC, PaginationItemSC, PaginationSC,
    ReviewSectionSC,
    ReviewTitleSC,
    ToggleSC,
    WrapperSC
} from "./Reviews";

export const VReviews = (props) => {
    const {setReviews, reviews, movieId, setCurrentReviewPage} = props;

    useEffect(() => {
            movie.getReviews(movieId, reviews.currentPage)
                .then(response => {
                    setReviews(response.data.results, response.data['total_pages']);
                })
        }, [movieId]
    );


    const reviewsList = reviews.data.map((item, index) => <ReviewItem key={index}
                                                                      author={item.author}
                                                                      date={item['created_at']}
                                                                      author_details={item.author_details}
                                                                      content={item.content}
    />);

    const myRef = useRef(null);
    const scrollTo = () => myRef.current.scrollIntoView();

    const selectPage = (item) => {
        scrollTo();
        setCurrentReviewPage(item);
        movie.getReviews(movieId, item)
            .then(response => {
                setReviews(response.data.results, response.data['total_pages']);
            })
    };

    let totalPagesArr = [];
    const totalPages = reviews.totalPages;
    for (let i = 1; i <= totalPages; i++) {
        totalPagesArr.push(i)
    }
    totalPagesArr = totalPagesArr.map((item, index) =>
        <PaginationItemSC key={index}
                          onClick={() => selectPage(item)}
                          isActive={item === reviews.currentPage ? 'red' : 'white'}>
            {item}
        </PaginationItemSC>);

    return (
        <ReviewSectionSC>
            <ReviewTitleSC ref={myRef}>
                COMMENTARIES
            </ReviewTitleSC>
            {reviews.data.length !== 0 ? <>{reviewsList}
                <PaginationSC>
                    {totalPagesArr}
                </PaginationSC>
            </> : <NoCommSC>
                No Commentaries :(
            </NoCommSC>}

        </ReviewSectionSC>
    )

};


const ReviewItem = (props) => {
    const {author, date, author_details, content} = props;
    const src = 'https://image.tmdb.org/t/p/original/' + author_details.avatar_path;
    const noSrc = 'https://socpartnerstvo.org/img/avatar_male.png';

    const [isOpen, setStyle] = useState(false);


    return (
        <WrapperSC>
            <AvatarSC src={author_details.avatar_path && author_details.avatar_path.includes('.com') ?
                noSrc : author_details.avatar_path ? src : noSrc}/>
            <BodySC>
                <InfoSC>
                    <NameSC>
                        {author}
                    </NameSC>
                    <DateSC>
                        {date.slice(0, date.indexOf('T'))}
                    </DateSC>
                </InfoSC>
                <ContentSC isHidden={isOpen}>
                    {content}
                </ContentSC>
                {
                    content.length > 1500 ?
                        <ToggleSC onClick={() => setStyle(!isOpen)}>
                            {isOpen ? 'Hide' : 'Show more'}
                        </ToggleSC> : ''
                }
            </BodySC>
        </WrapperSC>
    )
};

