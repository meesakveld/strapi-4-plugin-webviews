/*
 *
 * WebviewPage
 *
 */

import { useEffect, useState } from "react";
import { useFetchClient } from "@strapi/helper-plugin";
import { Loader } from "@strapi/design-system";

type Webview = {
  id: number;
  title: string;
  slug: string;
  url: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
};

const WebviewPage = () => {
  const [webview, setWebview] = useState<Webview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { get } = useFetchClient();

  const url = window.location.pathname;
  const id = url.split("/").pop();

  useEffect(() => {
    const fetchWebview = async () => {
      try {
        const response = await get(`/webviews/${id}`);
        setWebview(response.data);
      } catch (error) {
        console.error("Error fetching webview:", error);
      }
    };

    fetchWebview();
  }, [id]);

  return (
    <>
      {isLoading && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <Loader />
        </div>
      )}

      <iframe
        src={webview?.url}
        allowFullScreen
        style={{ width: "100%", height: "100vh" }}
        onLoad={() => setIsLoading(false)}
        title={webview?.title || "Webview"}
      ></iframe>
    </>
  );
};

export default WebviewPage;
