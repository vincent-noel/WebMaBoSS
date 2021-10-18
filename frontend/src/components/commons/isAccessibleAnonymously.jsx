function isAccessibleAnonymously(page) 
{
    return (
        page === "/register/" || page === "/login/" || page === "/models/" 
        || 
        (
            page.startsWith("/model/") && !page.startsWith("/model/maboss/sensitivity/")
        )
        || 
        page.startsWith("/tutorials/")
        || 
        page === "/about/"
    );
}

export default isAccessibleAnonymously;