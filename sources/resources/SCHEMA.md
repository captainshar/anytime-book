# Resource records

One file per Topic: `sources/resources/<topic>.yml` (for example `2.1.yml`). It is the verification log behind the "Where to get help" section of that Topic's page. CI reads it to find stale checks and duplicate phone numbers.

```yaml
topic: "2.1"
resources:
  - name: VoteRiders
    url: https://www.voteriders.org/freehelp/
    phone: "866-432-8683"        # digits as the org prints them; omit if none
    text: "866-432-8683"         # text line, if any
    hours: "Year-round"          # omit if 24/7 or not stated
    scope: national              # national | state | local | regional
    serves_where: "All US states" # required unless scope is national
    eligibility: "US citizens of voting age who need an ID"
    cost: free                   # free | low-cost | "<approx price>"
    prereqs: []                  # e.g. [photo ID, email, internet, proof of address]
    source_url: https://www.voteriders.org/freehelp/   # official page you checked
    verified_on: 2026-10-04
    verified_by: claude          # claude | sharon | <name>
    risk: high                   # high | medium | low (how bad a wrong detail would be)
    on_page: true                # false = kept for the record but not published
    notes: "Pays ID fees; also helps with birth certificates."
dropped:
  - name: Homeless ID Project
    reason: "Gemini called it national; it serves Phoenix and Tucson, AZ only."
    source_url: https://www.homelessidproject.org/
    checked_on: 2026-10-04
```

Rules:

- `verified_on` is the day you opened `source_url` and confirmed every field.
- Record anything from the Gemini doc you rejected under `dropped`, with the reason. This keeps the next person from re-adding it.
- Quote YAML strings that contain colons.
