using AssetMgmtApi.Models;

namespace AssetMgmtApi.Utils;

public class AssetQueryObject
{
    public string? Name { get; set; }
    public string? Category { get; set; }
    public AssetStatus? Status { get; set; } 
    
    //pagination properties
    public  int PageNumber { get; set; } = 1;
    private const int MaxPageSize = 50;
    private int _pageSize = 10;
    public  int PageSize 
    { 
        get => _pageSize;
        set =>_pageSize = (value > MaxPageSize) ? MaxPageSize : value; 
    } 
}

public class RequestQueryObject
{
    public RequestStatus? Status { get; set; }
    
    //pagination properties
    public  int PageNumber { get; set; } = 1;
    private const int MaxPageSize = 50;
    private int _pageSize = 10;
    public  int PageSize 
    { 
        get => _pageSize;
        set =>_pageSize = (value > MaxPageSize) ? MaxPageSize : value; 
    } 
}