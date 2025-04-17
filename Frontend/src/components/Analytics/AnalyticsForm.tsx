
import React, { useEffect, useState } from 'react';
import { useParams, Link, data } from 'react-router-dom';
import { dataService } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RefreshCcw, Database, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Analytics {
  [key: string]: {
    count: number;
    mean: number | string;
    min: number | string;
    max: number | string;
    range: number | string;
    std: number | string;
  };
}

interface Dataset {
  _id: string;
  datasetName: string;
  uploadedAt: string;
  rawData: any[];
}

const AnalyticsView: React.FC = () => {
  const { datasetId } = useParams<{ datasetId: string }>();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

  // Helper function to safely format numeric values
  const formatNumber = (value: any, decimals: number = 2): string => {
    // Check if value is a number
    if (typeof value === 'number' && !isNaN(value)) {
      return value.toFixed(decimals);
    }
    // Return the value as is if it's a string, or '-' if it's invalid
    return typeof value === 'string' ? value : '-';
  };

  useEffect(() => {
    if (!datasetId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        
         
        
        // First fetch the dataset to get its name and raw data
        const datasets = await dataService.getDatasets();
        const currentDataset = datasets.find((d: Dataset) => d._id === datasetId);
        
        if (currentDataset) {
          setDataset(currentDataset);
          
          // Then fetch the analytics
          const analyticsData = await dataService.getAnalytics();
          setAnalytics(analyticsData);
          
          // Prepare data for charts
          if (analyticsData) {
            const preparedChartData = Object.keys(analyticsData).map(key => {
              // Ensure values are numeric for the chart
              const mean = typeof analyticsData[key].mean === 'number' ? analyticsData[key].mean : 0;
              const min = typeof analyticsData[key].min === 'number' ? analyticsData[key].min : 0;
              const max = typeof analyticsData[key].max === 'number' ? analyticsData[key].max : 0;
              
              return {
                name: key,
                mean,
                min,
                max,
              };
            });
            setChartData(preparedChartData);
          }
        } else {
          toast({
            title: 'Dataset not found',
            description: 'The requested dataset could not be found.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast({
          title: 'Error loading analytics',
          description: 'Could not load analytics for this dataset. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [datasetId]);

  const refreshAnalytics = async () => {
    if (!datasetId) return;
    
    try {
      setLoading(true);
      const analyticsData = await dataService.getAnalytics();
      setAnalytics(analyticsData);
      
      // Update chart data with safe numeric values
      if (analyticsData) {
        const preparedChartData = Object.keys(analyticsData).map(key => {
          const mean = typeof analyticsData[key].mean === 'number' ? analyticsData[key].mean : 0;
          const min = typeof analyticsData[key].min === 'number' ? analyticsData[key].min : 0;
          const max = typeof analyticsData[key].max === 'number' ? analyticsData[key].max : 0;
          
          return {
            name: key,
            mean,
            min,
            max,
          };
        });
        setChartData(preparedChartData);
      }
      
      toast({
        title: 'Analytics refreshed',
        description: 'The analytics data has been updated.',
      });
    } catch (error) {
      console.error('Error refreshing analytics:', error);
      toast({
        title: 'Error refreshing analytics',
        description: 'Could not refresh analytics. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <Link to="/dashboard" className="flex items-center text-primary hover:underline mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{dataset?.datasetName || 'Dataset Analytics'}</h1>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <Database className="h-4 w-4 mr-1" />
            <span>
              {dataset?.rawData.length || 0} data points • Uploaded on{' '}
              {dataset?.uploadedAt
                ? new Date(dataset.uploadedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Unknown date'}
            </span>
          </div>
        </div>
        <Button variant="outline" onClick={refreshAnalytics} disabled={loading} className="mt-4 md:mt-0">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh Analytics
        </Button>
      </div>

      {analytics && Object.keys(analytics).length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(analytics).map((key) => (
              <Card key={key} className="stat-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">{key}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-muted-foreground">Mean</div>
                      <div className="font-semibold">{formatNumber(analytics[key].mean)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Count</div>
                      <div className="font-semibold">{analytics[key].count}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Min</div>
                      <div className="font-semibold">{formatNumber(analytics[key].min)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Max</div>
                      <div className="font-semibold">{formatNumber(analytics[key].max)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Range</div>
                      <div className="font-semibold">{formatNumber(analytics[key].range)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Std Dev</div>
                      <div className="font-semibold">{formatNumber(analytics[key].std)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {chartData.length > 0 && (
            <div className="analytics-card p-6">
              <h2 className="text-xl font-semibold flex items-center mb-4">
                <BarChart2 className="h-5 w-5 mr-2 text-primary" />
                Data Visualization
              </h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="mean" fill="hsl(var(--primary))" name="Mean" />
                    <Bar dataKey="min" fill="hsl(var(--accent))" name="Min" />
                    <Bar dataKey="max" fill="hsl(var(--accent))" opacity={0.7} name="Max" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 p-8 border border-dashed border-muted-foreground/50 rounded-lg">
          <BarChart2 className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium text-foreground mb-2">No analytics available</h3>
          <p className="text-muted-foreground text-center">
            There are no numeric fields in this dataset or analytics could not be calculated.
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsView;