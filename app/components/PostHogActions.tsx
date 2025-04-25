"use client"

import { useState } from "react"
import { usePostHog } from "posthog-js/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export function PostHogActions() {
  const posthog = usePostHog()
  const [personName, setPersonName] = useState("")
  const [groupName, setGroupName] = useState("")
  const [groupType] = useState("company") // We could make this configurable

  const identifyPerson = () => {
    if (!personName.trim()) {
      toast.error("Please enter a person name")
      return
    }
    
    posthog.identify(personName, {
      name: personName,
      source: "identify-test"
    })
    toast.success(`Identified person: ${personName}`)
    setPersonName("")
  }

  const identifyGroup = () => {
    if (!groupName.trim()) {
      toast.error("Please enter a group name")
      return
    }

    posthog.group(groupType, groupName, {
      name: groupName,
      source: "identify-test"
    })
    toast.success(`Identified group: ${groupName}`)
    setGroupName("")
  }

  const fireCustomEvent = () => {
    posthog.capture("test_event", {
      source: "identify-test",
      timestamp: new Date().toISOString()
    })
    toast.success("Fired test event")
  }

  const resetSession = () => {
    posthog.reset()
    toast.success("Reset PostHog session")
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Identify Person</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Input
            placeholder="Enter person name"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && identifyPerson()}
          />
          <Button onClick={identifyPerson}>Identify</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Identify Group</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Input
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && identifyGroup()}
          />
          <Button onClick={identifyGroup}>Identify</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button onClick={fireCustomEvent}>Fire Test Event</Button>
          <Button variant="destructive" onClick={resetSession}>Reset Session</Button>
        </CardContent>
      </Card>
    </div>
  )
} 