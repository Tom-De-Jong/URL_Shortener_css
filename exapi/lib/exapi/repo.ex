defmodule Exapi.Repo do
  use Ecto.Repo,
    otp_app: :exapi,
    adapter: Ecto.Adapters.Postgres
end
