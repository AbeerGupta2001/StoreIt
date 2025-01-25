import Image from "next/image";
import Link from "next/link";
import { Models } from "node-appwrite";


import { Chart } from "@/components/Chart";
import { Separator } from "@/components/ui/separator";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { convertFileSize, getUsageSummary } from "@/lib/utils";
import FormatedDateTime from "@/components/FormatedDateTime";
import ThumbNail from "@/components/ThumbNail";
import ActionDropDown from "@/components/ActionDropDown";


const Dashboard = async () => {
  // Parallel requests
  const [files, totalSpace] = await Promise.all([
    getFiles({ types: [], limit: 10 }),
    getTotalSpaceUsed(),
  ]);

  // Get usage summary
  const usageSummary = getUsageSummary(totalSpace);

  return (
    <div className="dashboard-container">
      <section>
        <Chart used={totalSpace.used} />

        {/* Uploaded file type summaries */}
        <ul className="dashboard-summary-list">
          {usageSummary.map((summary) => (
            <Link
              href={summary.url}
              key={summary.title}
              className="dashboard-summary-card"
            >
              <div className="space-y-4">
                <div className="flex justify-between gap-3">
                  <Image
                    src={summary.icon}
                    width={100}
                    height={100}
                    alt="uploaded image"
                    className="summary-type-icon"
                  />
                  <h4 className="summary-type-size">
                    {convertFileSize(summary.size) || 0}
                  </h4>
                </div>

                <h5 className="summary-type-title">{summary.title}</h5>
                <Separator className="bg-light-400" />
                <FormatedDateTime
                  date={summary.latestDate}
                  className="text-center"
                />
              </div>
            </Link>
          ))}
        </ul>
      </section>

      <section className="dashboard-recent-files">
        <h1 className="h1">Recent files uploaded</h1>
        <div className="flex flex-col gap-4 mt-8">
          {files.total > 0 ? (
            files.documents.map((file: Models.Document) => (
              <>
                <Link
                  href={file.url}
                  key={file.$id}
                  className="flex items-center justify-between"
                  target="_blank"
                >
                  <div className="flex cursor-pointer items-center gap-4">
                    <ThumbNail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="size-9 min-w-9"
                    />
                    <div>
                      <p className="recent-file-name">{file.name}</p>
                      <FormatedDateTime
                        date={file.$createdAt}
                        className="recent-file-date"
                      />
                    </div>
                  </div>
                  <ActionDropDown file={file} />
                </Link>
              </>
            ))
          ) : (
            <p className="text-xl mt-5">No file found</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
