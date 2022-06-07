import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function forDiscord(children) {
  return <div>{children}</div>;
}

export default function TempDownload() {
  const router = useRouter();
  const { uuid } = router.query;

  return (
    <div>
      <forDiscord>
        <h1>TempDownload</h1>
        <p>
          <a href={`/temp/${uuid}/`}>Download</a>
        </p>
      </forDiscord>
    </div>
  );
}
