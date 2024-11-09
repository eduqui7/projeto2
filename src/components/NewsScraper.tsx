'use client';

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface NewsItem {
  title: string;
  imageUrl: string;
  link: string;
}

interface ScrapingResult {
  data: NewsItem[] | null;
  status: 'idle' | 'loading' | 'success' | 'error';
}

export default function NewsScraper() {
  const [result, setResult] = useState<ScrapingResult>({
    data: null,
    status: 'idle'
  });
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    scrapeWebsite();
  }, []);

  useEffect(() => {
    if (result.status === 'loading') {
      const timer = setTimeout(() => {
        setProgress(66);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [result.status]);

  const exportToXLSX = () => {
    if (!result.data) return;

    const worksheet = XLSX.utils.json_to_sheet(
      result.data.map(news => ({
        'Título': news.title,
        'URL da Imagem': news.imageUrl,
        'Link': news.link
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Notícias');

    XLSX.writeFile(workbook, 'noticias-tvt.xlsx');
  };

  const scrapeWebsite = async () => {
    try {
      setResult({ data: null, status: 'loading' });
      setProgress(13);

      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: 'https://tvtnews.com.br/ultimas-noticias/' }),
      });

      const data = await response.json();

      const filteredData = data
        .filter((item: NewsItem) => item.imageUrl)
        .slice(0, 10);

      setProgress(100);
      setResult({
        data: filteredData,
        status: 'success'
      });
    } catch (error) {
      setResult({
        data: null,
        status: 'error'
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">TVT News - Últimas Notícias</h2>
        <div className="flex gap-2">
          {result.data && (
            <Button
              onClick={exportToXLSX}
              variant="outline"
            >
              Exportar XLSX
            </Button>
          )}
        </div>
      </div>

      {result.status === 'loading' && (
        <div className="flex items-center justify-center py-8">
          <Progress value={progress} className="w-[60%]" />
        </div>
      )}

      {result.status === 'success' && result.data && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagem</TableHead>
              <TableHead className="w-[500px]">Título</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.data.map((news, index) => (
              <TableRow key={index}>
                <TableCell>
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="h-16 w-24 object-cover rounded-md"
                  />
                </TableCell>
                <TableCell className="font-medium">{news.title}</TableCell>
                <TableCell>
                  <Button
                    variant="link"
                    asChild
                  >
                    <a
                      href={news.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Leia Mais
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {result.status === 'error' && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md flex items-center gap-2">
          <span className="font-medium">Erro ao trazer as notícias</span>
        </div>
      )}
    </div>
  );
}