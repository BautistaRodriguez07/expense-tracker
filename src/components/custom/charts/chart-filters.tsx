"use client";

import * as React from "react";
import { IoFilterSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { SpaceMemberDTO } from "@/features/space/actions/get-space-members.action";
import { useTranslations } from "next-intl";

type ChartFiltersProps = {
  spaceMembers: SpaceMemberDTO[];
  currencies: string[];
  filters: {
    days: number;
    responsibleId: string;
    currency: string;
    status: string;
  };
  onFiltersChange: (filters: {
    days: number;
    responsibleId: string;
    currency: string;
    status: string;
  }) => void;
};

export function ChartFilters(props: ChartFiltersProps) {
  const t = useTranslations("chartFilters");
  const [open, setOpen] = React.useState(false);

  // Count active filters
  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    if (props.filters.responsibleId !== "all") count++;
    if (props.filters.status !== "all") count++;
    return count;
  }, [props.filters.responsibleId, props.filters.status]);

  const handleChange = (
    key: keyof typeof props.filters,
    value: string | number
  ) => {
    props.onFiltersChange({
      ...props.filters,
      [key]: value,
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="sm" className="relative btn">
          <IoFilterSharp className="h-4 w-4 mr-2" />
          {t("filters")}
          {activeFiltersCount > 0 && (
            <Badge
              variant="default"
              className="ml-2 h-5 min-w-5 rounded-full px-1 text-xs"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 card-container !shadow-[0_8px_15px_1px_rgba(0,0,0,0.75)]"
        align="start"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="txt">{t("filterOptions")}</h4>
            <p className="text-xs txt-muted">{t("customizeYourChartView")}</p>
          </div>

          {/* Period filter */}
          <div className="space-y-2">
            <label className="text-xs txt-muted">{t("period")}</label>
            <Select
              value={props.filters.days.toString()}
              onValueChange={value => handleChange("days", Number(value))}
            >
              <SelectTrigger className="h-9 card-container !p-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="card-container !p-1">
                <SelectItem value="7">{t("last7Days")}</SelectItem>
                <SelectItem value="30">{t("last30Days")}</SelectItem>
                <SelectItem value="60">{t("last60Days")}</SelectItem>
                <SelectItem value="90">{t("last90Days")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Responsible filter */}
          <div className="space-y-2">
            <label className="text-xs txt-muted">{t("responsible")}</label>
            <Select
              value={props.filters.responsibleId}
              onValueChange={value => handleChange("responsibleId", value)}
            >
              <SelectTrigger className="h-9 card-container !p-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="card-container !p-1">
                <SelectItem value="all">{t("allUsers")}</SelectItem>
                {props.spaceMembers.map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Currency filter */}
          <div className="space-y-2">
            <label className="text-xs txt-muted">{t("currency")}</label>
            <Select
              value={props.filters.currency}
              onValueChange={value => handleChange("currency", value)}
            >
              <SelectTrigger className="h-9 card-container !p-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="card-container !p-1">
                {props.currencies.map(curr => (
                  <SelectItem key={curr} value={curr}>
                    {curr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status filter */}
          <div className="space-y-2">
            <label className="text-xs txt-muted">{t("status")}</label>
            <Select
              value={props.filters.status}
              onValueChange={value => handleChange("status", value)}
            >
              <SelectTrigger className="h-9 card-container !p-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="card-container !p-1">
                <SelectItem value="all">{t("all")}</SelectItem>
                <SelectItem value="paid">{t("paid")}</SelectItem>
                <SelectItem value="pending">{t("pending")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset filters button */}
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full btn"
              onClick={() => {
                handleChange("responsibleId", "all");
                handleChange("status", "all");
                setOpen(false);
              }}
            >
              {t("resetFilters")}
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
