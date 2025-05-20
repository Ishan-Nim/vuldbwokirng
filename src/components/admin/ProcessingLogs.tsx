import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { LogEntry, BlogLink, CounterProps } from './types';

interface ProcessingLogsProps {
  title: string;
  description: string;
  logs?: LogEntry[];
  blogLinks?: BlogLink[];
  autoRefresh?: boolean;
  counter?: CounterProps;
}

const ProcessingLogs: React.FC<ProcessingLogsProps> = ({ title, description, logs, blogLinks, autoRefresh, counter }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        {counter && (
          <div className="absolute top-0 right-0 p-4 text-sm text-muted-foreground">
            {counter.label}: {counter.value}
          </div>
        )}
        {logs && logs.length > 0 ? (
          <ul className="list-none p-0">
            {logs.map((log, index) => (
              <li key={index} className="py-2 border-b last:border-b-0">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">{log.timestamp}</div>
                  <div className={`text-sm font-medium ${
                    log.type === 'error' ? 'text-severity-critical' :
                    log.type === 'warning' ? 'text-severity-medium' :
                    log.type === 'success' ? 'text-severity-low' :
                    'text-muted-foreground'
                  }`}>{log.message}</div>
                </div>
              </li>
            ))}
          </ul>
        ) : blogLinks && blogLinks.length > 0 ? (
          <ul className="list-none p-0">
            {blogLinks.map((blog, index) => (
              <li key={index} className="py-2 border-b last:border-b-0">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">{blog.timestamp}</div>
                  <Link to={`/vulnerability/${blog.id}`} className="text-sm font-medium text-blue-500 hover:underline">{blog.title}</Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-muted-foreground">No logs to display.</div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProcessingLogs;
