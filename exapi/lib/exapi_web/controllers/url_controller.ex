defmodule ExapiWeb.URLController do
  use ExapiWeb, :controller

  #Makes url, passes message var if true
  def make_url(conn, %{"url" => url} = params) do
    message = Map.get(params, "message", false)

    encoded = Exapi.Backend.encode(url, message)
    json(conn, %{encoded: encoded})
  end

  def visit(conn, %{"encoded" => encoded}) do

    message = if String.ends_with?(encoded, "~"), do: true, else: false

    #If the url is nil, returns not found, if url is a message returns message page, if url is redirectable, redirects
    case Exapi.Backend.decode(encoded, message) do

      nil -> conn |> put_status(:not_found) |> json(%{error: "URL not found"})

      decoded -> if message, do: render_message(conn, decoded), else: redirect(conn, external: decoded)
    end
  end

  def clicks(conn, %{"encoded" => encoded}) do
    clicks = Exapi.Backend.get_clicks(encoded)
    json(conn, %{clicks: clicks})
  end

  defp render_message(conn, message) do
    safe_message = message
      |> String.replace("&", "&amp;")
      |> String.replace("<", "&lt;")
      |> String.replace(">", "&gt;")
      |> String.replace("\"", "&quot;")

    template_path = Path.join(:code.priv_dir(:exapi), "static/message_template.html")
    {:ok, template} = File.read(template_path)
    html = String.replace(template, "{{MESSAGE_PLACEHOLDER}}", safe_message)

    conn
    |> put_resp_content_type("text/html")
    |> send_resp(200, html)
  end
end
