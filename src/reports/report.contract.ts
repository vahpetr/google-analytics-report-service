export interface SimpleReportRequest {
    dateRanges: SimpleReportRequestDateRange[];
    metrics: SimpleReportRequestMetric[];
    dimensions?: SimpleReportRequestDimension[];
    segments?: SimpleReportRequestSegment[];
    pageSize: number;
    viewId: string;
    pageToken?: string;
    samplingLevel: string;
}

export interface SimpleReportRequestDateRange {
    endDate: string;
    startDate: string;
}

export interface SimpleReportRequestMetric {
    expression: string;
}

export interface SimpleReportRequestDimension {
    name: string;
}

export interface SimpleReportRequestSegment {
    segmentId: string;
}

export interface SimpleReportsResponse {
    queryCost: number;
    reports: SimpleReportResponse[];
}

export interface SimpleReportResponse {
    columnHeader: SimpleReportResponseColumnHeader;
    data: SimpleReportResponseReportData;
    nextPageToken?: string;
}

export interface SimpleReportResponseColumnHeader {
    dimensions: string[];
    metricHeader: SimpleReportResponseMetricHeader;
}

export interface SimpleReportResponseMetricHeader {
    metricHeaderEntries: SimpleReportResponseMetricHeaderEntry[];
    pivotHeaders: SimpleReportResponsePivotHeader[];
}

export interface SimpleReportResponseMetricHeaderEntry {
    name: string;
    type: string;
}

export interface SimpleReportResponsePivotHeader {
    pivotHeaderEntries: SimpleReportResponsePivotHeaderEntry[];
    totalPivotGroupsCount: number;
}

export interface SimpleReportResponsePivotHeaderEntry {
    dimensionNames: string[];
    dimensionValues: string[];
    metric: SimpleReportResponseMetricHeaderEntry;
}

export interface SimpleReportResponseReportData {
    dataLastRefreshed: string;
    isDataGolden: boolean;
    maximums: SimpleReportResponseDateRangeValues[];
    minimums: SimpleReportResponseDateRangeValues[];
    rowCount: number;
    rows: SimpleReportResponseReportRow[];
    samplesReadCounts: string[];
    samplingSpaceSizes: string[];
    totals: SimpleReportResponseDateRangeValues[];
}

export interface SimpleReportResponseReportRow {
    dimensions: string[];
    metrics: SimpleReportResponseDateRangeValues[];
}

export interface SimpleReportResponseDateRangeValues {
    pivotValueRegions: SimpleReportResponsePivotValueRegion[];
    values: string[];
}

export interface SimpleReportResponsePivotValueRegion {
    values: string[];
}

export interface GoogleOauth2WebKeys {
    web: GoogleOauth2Web;
}

export interface GoogleOauth2Web {
    client_id: string;
    project_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_secret: string;
    redirect_uris: string[];
    javascript_origins: string[];
}
