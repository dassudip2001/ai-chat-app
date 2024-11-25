import React from "react";
import ReactMarkdown from "react-markdown";

type MarkdownRendererProps = {
  content: string;
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return <ReactMarkdown>{content}</ReactMarkdown>;
};

export default MarkdownRenderer;