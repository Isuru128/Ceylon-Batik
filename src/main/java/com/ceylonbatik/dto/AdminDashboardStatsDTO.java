package com.ceylonbatik.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardStatsDTO {

    private long totalProducts;
    private long activeProducts;
    private long totalUsers;
    private long totalOrders;
    private double totalSales;
    private long subscriberCount;
}
