module.exports = {
    dbURI: '',
    google: {
        clientID: '',
        clientSecret: ''
    },
    cookieKey: '',
    existingFilters: {
        countries: [
            { data: 'US', text: 'United States' },
            { data: 'UK', text: 'United Kingdom'},
            { data: 'JP', text: 'Japan'},
            { data: 'KR', text: 'South Korea'},
            { data: 'FR', text: 'France'}
        ],
        types: [
            { data: 'TV Series', text: 'TV Series' },
            { data: 'Movie', text: 'Movie' },
            { data: 'TV Show', text: 'TV Show' }
        ],
        genres: [
            { data: 'Action', text: 'Action' },
            { data: 'Mystery', text: 'Mystery' },
            { data: 'Crime', text: 'Crime' },
            { data: 'Drama', text: 'Drama' },
            { data: 'Comedy', text: 'Comedy' },
        ],
        status: [
            { data: 'Ongoing', text: 'Ongoing' },
            { data: 'Ended', text: 'Ended'},
            { data: 'Canceled', text: 'Canceled'},
            { data: 'Returning Series', text: 'Returning'},
        ],
        sort: [
            { data: 'Newest', text: 'Newest' },
            { data: 'Oldest', text: 'Oldest' },
            { data: 'Rating LtH', text: 'Rating Low to High' },
            { data: 'Rating HtL', text: 'Rating High to Low' },
            { data: 'Popularity LtH', text: 'Popularity Low to High' },
            { data: 'Popularity HtL', text: 'Popularity High to Low' },
        ],
        genders: [
            { data: 'Male', text: 'Male' },
            { data: 'Female', text: 'Female' }
        ]
    }
}