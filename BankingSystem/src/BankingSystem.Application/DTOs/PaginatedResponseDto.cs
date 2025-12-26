namespace BankingSystem.src.BankingSystem.Application.DTOs;

public record class PaginatedResponseDto<T>{
        public IEnumerable<T> Items { get; set; } = Enumerable.Empty<T>();
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
    }