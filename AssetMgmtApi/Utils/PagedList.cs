namespace AssetMgmtApi.Utils;

public class PagedList<T>
{
    // The items for the current page
    public List<T> Items { get; }

    // Metadata
    public int CurrentPage { get; }
    public int PageSize { get; }
    public int TotalCount { get; }
    private int TotalPages { get; }

    public bool HasPreviousPage => CurrentPage > 1;
    public bool HasNextPage => CurrentPage < TotalPages;

    public PagedList(List<T> items, int totalCount, int currentPage, int pageSize)
    {
        Items = items;
        TotalCount = totalCount;
        CurrentPage = currentPage;
        PageSize = pageSize;
        TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
    }
}