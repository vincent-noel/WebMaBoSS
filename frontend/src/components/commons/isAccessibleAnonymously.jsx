function isAccessibleAnonymously(page) 
{
    return (
        page === "/register/" || page === "/login/" || page === "/models/" 
        || 
        (
            page.startsWith("/model/") && !page.startsWith("/model/maboss/sensitivity/")
        )
    );
}

export default isAccessibleAnonymously;